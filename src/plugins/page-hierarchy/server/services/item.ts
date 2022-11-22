import { IItem } from "../content-types/Item";
import { IPage } from "../content-types/page";
import pluginId from "../pluginId";
import { Knex } from "knex";
import { singular } from "pluralize";
import { convertKeysFromSnakeCaseToCamelCase } from "../utils";

const MODEL = "item";

const transformDbItems = (dbItem) => ({
  ...convertKeysFromSnakeCaseToCamelCase(dbItem),
  // TODO: refactor frontend or DB for consistent flow
  parentId: dbItem.parent_item,
  pageId: dbItem.page,
});

// add default strapi connection as default value ???
const duplicateItem = async (
  tableName: string,
  item: Record<string, unknown>,
  customAttrs: Record<string, unknown>
  // { transacting }: { transacting: Knex.Transaction<any, any[]> }
) => {
  const knex = (strapi.db as any).connection as Knex;
  const newItem = Object.fromEntries(
    Object.entries({
      ...item,
      ...customAttrs,
    }).map(([key, value]) =>
      // TODO: resolve inconsistent knex api
      // for adding `Object`/`Array` as a JSON field in the database
      [
        key,
        Array.isArray(value) || (value && value.constructor) === Object
          ? JSON.stringify(value)
          : value,
      ]
    )
  );

  // id is auto-increment and could not be setted by page
  delete newItem.id;
  const [insertedRowId] = await knex(tableName).insert(newItem).returning("id");

  return insertedRowId;
};

/**
 * tricky strapi magic recursive backup function
 * recursively duplicates nested _components table
 *
 * @param {string} tableName - input with table name with '{table}s' postfix
 * @param {number} sourceRowId - whole function works only on SQL databases with auto_increment id
 * @returns ID of created row
 *
 */
const recursiveCopyRowFrom = async (
  tableName: string,
  sourceRowId: number
  // { transacting }: { transacting: Knex.Transaction<any, any[]> }
) => {
  const knex = (strapi.db as any).connection as Knex;

  const itemToDuplicate = await knex(tableName)
    .where("id", sourceRowId)
    .first();

  const duplicatedRowId = await duplicateItem(
    tableName,
    itemToDuplicate,
    undefined
    // { transacting }
  );
  const componentTableName = `${tableName}_components`;

  // TODO: test that postgreSQL have same consistent API
  const isComponentTableExists = await knex.schema.hasTable(componentTableName);

  // if nested component table exist -> continue with recursion
  if (isComponentTableExists) {
    // pluralize table name is officially supported by strapi
    // > https://github.com/strapi/strapi/blob/8aafa1b53abca10cac44128997a553f225cad91e/packages/strapi-connector-bookshelf/lib/generate-component-relations.js#L15
    const joinComponentTableColumnName = `${singular(tableName)}_id`;

    const connectedComponents = await knex(componentTableName).where(
      joinComponentTableColumnName,
      sourceRowId
    );

    // I can't use `Promise.all` coz `last_insert_rowid()` starts to be inconsistent and db will be inconsistent
    for (const component of connectedComponents) {
      const createdComponentId = await recursiveCopyRowFrom(
        component.component_type,
        component.component_id
        // { transacting }
      );

      await duplicateItem(
        componentTableName,
        component,
        {
          component_id: createdComponentId,
          [joinComponentTableColumnName]: duplicatedRowId,
        }
        // { transacting }
      );
    }
  }

  return duplicatedRowId;
};

const service = {
  flatFind: async () =>
    (await strapi.entityService.findMany(`plugin::${pluginId}.${MODEL}`, {
      populate: {
        parent_item: true,
      },
      sort: { child_order: "ASC" },
    })) as any[],
  /**
   * Promise to fetch all records
   *
   * @return {Promise}
   */
  find: async (where?: Record<string, unknown>): Promise<IItem[]> => {
    const knex = (strapi.db as any).connection as Knex;
    knex("items").where({ id: 1 }).then(console.log);
    knex("pages").insert({}).returning("id");

    return (await strapi.entityService.findMany(
      `plugin::${pluginId}.${MODEL}`,
      {
        populate: {
          parent_item: true,
        },
      }
    )) as IItem[];
  },
  /**
   * Promise to fetch record
   *
   * @return {Promise}
   */
  findOne: async (id: string): Promise<IItem> =>
    (await strapi.query(`plugin::${pluginId}.${MODEL}`).findOne({ id })) as any,
  updateItems: async (
    bodyItems: IItem[],
    bodyPages: IPage[]
    // transaction?: Knex.Transaction<any, any[]>
  ) => {
    // const knex = (strapi.db as any).connection as Knex;
    const [dbPages, dbItems] = await Promise.all([
      strapi.entityService.findMany(`plugin::${pluginId}.page`) as IPage[],
      strapi.query(`plugin::${pluginId}.item`).findMany() as IItem[],
    ]);

    const bodyPageIds = bodyPages.map(({ id }) => id);
    const initDbPageIds = dbPages.map(({ id }) => id);
    const pagesToAddToDb = bodyPages.filter(
      (page) => !initDbPageIds.includes(page.id)
    );

    const pagesToCreate = pagesToAddToDb.filter(
      (p) => !p._duplicatedFromPageId
    );
    const pagesToBeDuplicated = pagesToAddToDb.filter((p) =>
      Boolean(p._duplicatedFromPageId)
    );
    const pagesIdsToDelete = initDbPageIds.filter(
      (id) => !bodyPageIds.includes(id)
    );

    // -----------------------------------
    // --------- API validations ---------
    // todo: what about that id prefix rule?
    if (
      pagesToBeDuplicated.some((page) =>
        `${page._duplicatedFromPageId}`.includes("feGenerated-")
      )
    ) {
      throw new Error(
        "inconsistent page duplication from `efe generated` page"
      );
    }

    // -----------------------------------------------------------
    // ------------------- sync pages ----------------------------
    // -----------------------------------------------------------
    // whole data mutation code is wrapped into one sql transaction
    // for better consistent data model if some of the inserts will not work correctly
    // const trx = transaction || (await knex.transaction());

    const duplicatedPages = [];
    // I can't write data asynchronously (`Promise.all`) because
    // `last_insert_rowid()` starts to be inconsistent and database connections will be incorrect
    for (const pageToBeDuplicated of pagesToBeDuplicated) {
      const sourceRowId = pageToBeDuplicated._duplicatedFromPageId;
      const pageDuplicatedRowId = await recursiveCopyRowFrom(
        "pages",
        sourceRowId
        // {
        //   transacting: trx,
        // }
      );
      duplicatedPages.push([pageToBeDuplicated.id, pageDuplicatedRowId]);
    }

    const pageQueriesToCreate = pagesToCreate.map(async (newPage) => [
      newPage.id,
      await strapi.entityService.create(`plugin::${pluginId}.page`, {
        data: {
          title: newPage.title,
          slug: newPage.slug,
          publication_state: "draft",
        },
      }),
    ]);

    const pageQueriesToDelete = pagesIdsToDelete.map((id) =>
      strapi.entityService.delete(`plugin::${pluginId}.page`, id)
    );

    const [createdPages] = await Promise.all([
      Promise.all(pageQueriesToCreate),
      Promise.all(pageQueriesToDelete),
    ]);

    // mapped client-generated-ids x db-ids HASH-MAP
    // TODO: it includes pages to delete
    const pageFrontEndIdDatabaseIdMapper = Object.fromEntries([
      ...initDbPageIds.map((id) => [id, id]),
      ...duplicatedPages,
      ...createdPages.map(([feId, page]) => [feId, page.id]),
    ]);

    // -----------------------------------------------------------
    // ------------------- sync items ----------------------------
    // -----------------------------------------------------------
    const bodyItemIds = bodyItems.map(({ id }) => id);
    const initDbItemIds = dbItems.map(({ id }) => id);
    const itemsToCreate = bodyItems.filter(
      (item) => !initDbItemIds.includes(item.id)
    );
    const itemsToUpdate = bodyItems.filter((item) =>
      initDbItemIds.includes(item.id)
    );
    const itemsIdsToDelete = initDbItemIds.filter(
      (id) => !bodyItemIds.includes(id)
    );

    // first of all crate new empty skeleton of items without parent_item reference
    // then we will fill them with validate SQL relationship IDs
    // problem is that we don't know real SQL IDs from the frontend application
    // so we have to first get the IDS and than recalculate relation (parent_item) ships by
    // FE-DB-ID mapper
    const itemQueriesToCreate = itemsToCreate.map(async (i) => [
      i.id,
      await strapi.entityService.create(`plugin::${pluginId}.item`, {
        data: {},
      }),
    ]);
    const createdItems = await Promise.all(itemQueriesToCreate);

    // mapped client-generated-ids x db-ids HASH-MAP
    // TODO: it includes items to delete
    const itemFrontEndIdDatabaseIdMapper = Object.fromEntries([
      ...initDbItemIds.map((id) => [id, id]),
      ...createdItems.map(([feId, item]) => [feId, item.id]),
    ]);
    // first of all i create empty items for getting IDs then i update values
    const itemQueriesToUpdate = [...itemsToCreate, ...itemsToUpdate].map((i) =>
      strapi.entityService.update(
        `plugin::${pluginId}.item`,
        itemFrontEndIdDatabaseIdMapper[i.id],
        {
          data: {
            page:
              i.type === "PAGE" ||
              i.type === "HARD_LINK" ||
              i.type === "SYMBOLIC_LINK"
                ? pageFrontEndIdDatabaseIdMapper[i.pageId]
                : null,
            // TODO; rename `paren_item` to the ` parent_item_id`
            parent_item: itemFrontEndIdDatabaseIdMapper[i.parentId] || null,
            name: i.name,
            absolute_link_url: i.absoluteLinkUrl,
            child_order: i.childOrder,
            is_visible: i.isVisible,
            is_protected: i.isProtected,
            is_highlighted: i.isHighlighted,
            exclude_from_hierarchy: i.excludeFromHierarchy,
            go_to_closest_child: i.goToClosestChild,
            visible_from: null,
            visible_to: null,
            type: i.type,
          },
        }
      )
    );
    const itemQueriesToDelete = itemsIdsToDelete.map((id) =>
      strapi.entityService.delete(`plugin::${pluginId}.item`, id)
    );
    await Promise.all([
      Promise.all(itemQueriesToUpdate),
      Promise.all(itemQueriesToDelete),
    ]);
    // await trx.commit();
    const [updatedPages, updatedDbItems] = await Promise.all([
      await strapi.entityService.findMany(`plugin::${pluginId}.page`),
      await strapi.entityService.findMany(`plugin::${pluginId}.item`),
    ]);

    return {
      pages: updatedPages.map(convertKeysFromSnakeCaseToCamelCase),
      items: updatedDbItems.map(transformDbItems),
      pageFrontEndIdDatabaseIdMapper,
      itemFrontEndIdDatabaseIdMapper,
    };
  },
} as const;

export type ItemsService = typeof service;

export default service;
