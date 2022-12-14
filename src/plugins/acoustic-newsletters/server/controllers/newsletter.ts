import { Context } from "koa";
import pluginId from "../pluginId";

export default {
  setIsSended: async (ctx: Context) => {
    const body: any = ctx.request.body;
    console.log("set is sended", body);

    try {
      const res = await strapi.entityService.update(
        `plugin::${pluginId}.newsletter`,
        body.id,
        {
          data: {
            isSended: true,
          },
        }
      );
      return res;
    } catch (err) {
      console.log(err);
      throw new Error(err.toString());
    }
  },

  getAcousticNewsletterConfig: (ctx: Context) => {
    const data = strapi.config.acousticNewsletters;
    ctx.body = data;
  },

  find: async (ctx: Context) => {
    return strapi.entityService.findMany(`plugin::${pluginId}.newsletter`, {
      populate: "*",
    });
  },
};
