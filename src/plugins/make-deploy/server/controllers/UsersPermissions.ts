import * as _ from "lodash";

export default {
  async getRole(ctx) {
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

  async getRoles(ctx) {
    try {
      const roles = await strapi.plugins[
        "users-permissions"
      ].services.userspermissions.getRoles();

      ctx.send({ roles });
    } catch (err) {
      ctx.badRequest(null, [{ messages: [{ id: "Not found" }] }]);
    }
  },

  async getRoutes(ctx) {
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
