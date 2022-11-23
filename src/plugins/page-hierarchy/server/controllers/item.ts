import { sanitize } from "@strapi/utils";
import { Context } from "koa";
import pluginId from "../pluginId";
import { ItemsService, transformDbItems } from "../services/item";

const service = () => strapi.plugin(pluginId).service("item") as ItemsService;

// TODO:
// > add data validations?
// > add cascade deleting?
// > add authorization + authentication
// > add sanitizeEntity
export default {
  // flat prefix mean that the endpoint returns only item table data (not components etc...)
  // fetch data without nested data joins created by Content-Types Builder
  flatFind: async () => (await service().flatFind()).map(transformDbItems),
  find: async (ctx: Context) => {
    const items = await service().find(ctx.query);

    // console.log(strapi.getModel(`plugin::${pluginId}.item`), ctx.query, items);
    // console.log(strapi.plugin(pluginId).contentTypes);

    return Promise.all(
      items.map(
        async (entity) =>
          await sanitize.contentAPI.output(
            entity,
            strapi.getModel(`plugin::${pluginId}.item`)
          )
      )
    );
  },
  findOne: async (ctx: Context) =>
    await sanitize.contentAPI.output(
      await service().findOne(ctx.params.id),
      strapi.getModel(`plugin::${pluginId}.item`)
    ),
  updateItems: async (ctx: Context) => {
    // const trx = await ((strapi.db as any).connection as Knex).transaction();
    try {
      const body = (ctx.request as any).body;
      const bodyItems = body.items;
      const bodyPages = body.pages;
      console.log("START UPDATE\n", bodyItems, "\nPAGES:\n", bodyPages);
      // return [];
      return service().updateItems(bodyItems, bodyPages);
    } catch (err) {
      console.error(err);
      ctx.status = 500;

      // if (trx && !trx.isCompleted()) {
      //   await trx.rollback();
      // }

      return err.toString();
    }
  },
};