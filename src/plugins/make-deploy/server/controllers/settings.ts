/**
 * A set of functions called "actions" for `settings`
 */

export default {
  find: async (ctx) => {
    try {
      ctx.body = await strapi.plugin("make-deploy").service("settings").find();
    } catch (err) {
      ctx.throw(500, err);
    }
  },
  create: async (ctx) => {
    const { body } = ctx.request;
    try {
      ctx.body = await strapi
        .plugin("make-deploy")
        .service("settings")
        .create(body);
    } catch (err) {
      ctx.throw(500, err);
    }
  },
  updateOne: async (ctx) => {
    const { body } = ctx.request;
    try {
      ctx.body = await strapi
        .plugin("make-deploy")
        .service("settings")
        .updateOne(ctx.params.id, body);
    } catch (err) {
      ctx.throw(500, err);
    }
  },
  deleteOne: async (ctx) => {
    try {
      ctx.body = await strapi
        .plugin("make-deploy")
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
