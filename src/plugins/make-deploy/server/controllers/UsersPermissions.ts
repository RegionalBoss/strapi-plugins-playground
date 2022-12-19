import * as _ from "lodash";
import { Context } from "koa";

export default {
  async getRole(ctx: Context) {
    const { id } = ctx.params;
    const { lang } = ctx.query;
    const plugins = await strapi.plugins[
      "users-permissions"
    ].services.userspermissions.getPlugins(lang);
    const role = await strapi.plugins[
      "users-permissions"
    ].services.userspermissions.getRole(id, plugins);

    if (_.isEmpty(role)) {
      return ctx.badRequest(null, [{ messages: [{ id: `Role don't exist` }] }]);
    }

    ctx.send({ role });
  },

  async getRoles(ctx: Context) {
    try {
      const roles = await strapi.plugins[
        "users-permissions"
      ].services.userspermissions.getRoles();

      ctx.send({ roles });
    } catch (err) {
      ctx.badRequest(null, [{ messages: [{ id: "Not found" }] }]);
    }
  },

  async getRoutes(ctx: Context) {
    try {
      const routes = await strapi.plugins[
        "users-permissions"
      ].services.userspermissions.getRoutes();

      ctx.send({ routes });
    } catch (err) {
      ctx.badRequest(null, [{ messages: [{ id: "Not found" }] }]);
    }
  },
};
