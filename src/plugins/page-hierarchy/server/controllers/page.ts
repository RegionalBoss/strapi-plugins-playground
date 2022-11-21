import { Context } from "koa";
import pluginId from "../pluginId";
import { convertKeysFromSnakeCaseToCamelCase } from "../utils";
export default {
  findOne: async (ctx: Context) => {
    const { id } = ctx.params;
    return strapi.entityService.findOne(`plugin::${pluginId}.page`, id);
  },
  // flat prefix mean that the endpoint returns only item table data (not components etc...)
  flatFind: async (ctx: Context) => {
    // I don't want to send collection-Types builder attributes
    const data = await strapi.entityService.findMany(
      `plugin::${pluginId}.page`
    );
    console.log("pages flat find", data);
    return (
      data
        // todo: add sanitizeEntity
        // .map(p => sanitizeEntity(p, { model: global.strapi.models.page }))
        .map(convertKeysFromSnakeCaseToCamelCase)
    );
  },
  find: async (ctx: Context) => {
    return strapi.entityService.findMany(`plugin::${pluginId}.page`);
  },
};
