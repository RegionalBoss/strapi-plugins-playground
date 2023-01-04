/**
 * A set of functions called "actions" for `settings`
 */

import pluginId from "../pluginId";
import { validateSettings } from "../validators/settings";

export default {
  find: async (ctx) => {
    try {
      ctx.body = await strapi.plugin(pluginId).service("settings").find();
    } catch (err) {
      ctx.throw(500, err);
    }
  },
  create: async (ctx) => {
    const { body } = ctx.request;
    const { error } = await validateSettings(body);
    if (error) return ctx.badRequest("ValidationError", { errors: error });
    try {
      ctx.body = await strapi.plugin(pluginId).service("settings").create(body);
    } catch (err) {
      ctx.throw(500, err);
    }
  },
  updateOne: async (ctx) => {
    const { body } = ctx.request;
    const { error } = await validateSettings(body);
    if (error) return ctx.badRequest("ValidationError", { errors: error });
    try {
      ctx.body = await strapi
        .plugin(pluginId)
        .service("settings")
        .updateOne(ctx.params.id, body);
    } catch (err) {
      ctx.throw(500, err);
    }
  },
  deleteOne: async (ctx) => {
    try {
      ctx.body = await strapi
        .plugin(pluginId)
        .service("settings")
        .deleteOne(ctx.params.id);
    } catch (err) {
      ctx.throw(500, err);
    }
  },
  // exampleAction: async (ctx, next) => {
  //   try {
  //     ctx.body = 'ok';
  //   } catch (err) {
  //     ctx.body = err;
  //   }
  // }
};
