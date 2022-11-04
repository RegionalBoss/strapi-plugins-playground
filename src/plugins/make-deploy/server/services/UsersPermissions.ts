import * as _ from "lodash";

/**
 * UsersPermissions.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

const DEFAULT_PERMISSIONS = [
  {
    action: "admincallback",
    controller: "auth",
    type: "users-permissions",
    roleType: "public",
  },
  {
    action: "adminregister",
    controller: "auth",
    type: "users-permissions",
    roleType: "public",
  },
  {
    action: "callback",
    controller: "auth",
    type: "users-permissions",
    roleType: "public",
  },
  {
    action: "connect",
    controller: "auth",
    type: "users-permissions",
    roleType: null,
  },
  {
    action: "forgotpassword",
    controller: "auth",
    type: "users-permissions",
    roleType: "public",
  },
  {
    action: "register",
    controller: "auth",
    type: "users-permissions",
    roleType: "public",
  },
  {
    action: "emailconfirmation",
    controller: "auth",
    type: "users-permissions",
    roleType: "public",
  },
  {
    action: "resetpassword",
    controller: "auth",
    type: "users-permissions",
    roleType: "public",
  },
  {
    action: "init",
    controller: "userspermissions",
    type: null,
    roleType: null,
  },
  {
    action: "me",
    controller: "user",
    type: "users-permissions",
    roleType: null,
  },
  { action: "autoreload", controller: null, type: null, roleType: null },
];

const isPermissionEnabled = (permission, role) =>
  DEFAULT_PERMISSIONS.some(
    (defaultPerm) =>
      (defaultPerm.action === null ||
        permission.action === defaultPerm.action) &&
      (defaultPerm.controller === null ||
        permission.controller === defaultPerm.controller) &&
      (defaultPerm.type === null || permission.type === defaultPerm.type) &&
      (defaultPerm.roleType === null || role.type === defaultPerm.roleType)
  );

export default {
  getActions() {
    const generateActions = (data) =>
      Object.keys(data).reduce((acc, key) => {
        if (_.isFunction(data[key])) {
          acc[key] = { enabled: false, policy: "" };
        }

        return acc;
      }, {});

    const appControllers = Object.keys(strapi.api || {})
      .filter((key) => !!strapi.api[key].controllers)
      .reduce(
        (acc, key) => {
          Object.keys(strapi.api[key].controllers).forEach((controller) => {
            acc.controllers[controller] = generateActions(
              strapi.api[key].controllers[controller]
            );
          });

          return acc;
        },
        { controllers: {} }
      );

    const pluginsPermissions = Object.keys(strapi.plugins).reduce(
      (acc, key) => {
        const initialState = {
          controllers: {},
        };

        acc[key] = Object.keys(strapi.plugins[key].controllers).reduce(
          (obj, k) => {
            obj.controllers[k] = generateActions(
              strapi.plugins[key].controllers[k]
            );

            return obj;
          },
          initialState
        );

        return acc;
      },
      {}
    );

    const permissions = {
      application: {
        controllers: appControllers.controllers,
      },
    };

    return _.merge(permissions, pluginsPermissions);
  },

  async getRole(roleID, plugins) {
    const role = await strapi
      .query("plugin::users-permissions.role")
      .findOne({ id: roleID }, ["permissions"]);

    if (!role) {
      throw new Error("Cannot find this role");
    }

    // Group by `type`.
    const permissions = role.permissions.reduce((acc, permission) => {
      _.set(
        acc,
        `${permission.type}.controllers.${permission.controller}.${permission.action}`,
        {
          enabled: _.toNumber(permission.enabled) !== 0,
          policy: permission.policy,
        }
      );

      if (
        permission.type !== "application" &&
        !acc[permission.type].information
      ) {
        acc[permission.type].information =
          plugins.find((plugin) => plugin.id === permission.type) || {};
      }

      return acc;
    }, {});

    return {
      ...role,
      permissions,
    };
  },

  async getRoles() {
    const roles = await strapi
      .query("plugin::users-permissions.role")
      .find({ _sort: "name" }, []);

    for (let i = 0; i < roles.length; ++i) {
      roles[i].nb_users = await strapi
        .query("plugin::users-permissions.user")
        .count({ role: roles[i].id });
    }

    return roles;
  },

  async getRoutes() {
    const routes = Object.keys(strapi.api || {}).reduce((acc, current) => {
      return acc.concat(_.get(strapi.api[current].config, "routes", []));
    }, []);
    const clonedPlugins = _.cloneDeep(strapi.plugins);
    const pluginsRoutes = Object.keys(clonedPlugins || {}).reduce(
      (acc, current) => {
        const routes = _.get(
          clonedPlugins,
          [current, "config", "routes"],
          []
        ).reduce((acc, curr) => {
          const prefix = curr.config.prefix;
          const path =
            prefix !== undefined
              ? `${prefix}${curr.path}`
              : `/${current}${curr.path}`;
          _.set(curr, "path", path);

          return acc.concat(curr);
        }, []);

        acc[current] = routes;

        return acc;
      },
      {}
    );

    return _.merge({ application: routes }, pluginsRoutes);
  },

  async initialize() {
    const roleCount = await strapi
      .query("plugin::users-permissions.role")
      .count();

    if (roleCount === 0) {
      await strapi.query("plugin::users-permissions.role").create({
        name: "Authenticated",
        description: "Default role given to authenticated user.",
        type: "authenticated",
      });

      await strapi.query("plugin::users-permissions.role").create({
        name: "Public",
        description: "Default role given to unauthenticated user.",
        type: "public",
      });
    }

    return this.updatePermissions();
  },

  async updateUserRole(user, role) {
    return strapi
      .query("plugin::users-permissions.user")
      .update({ id: user.id }, { role });
  },

  template(layout, data) {
    const compiledObject = _.template(layout);
    return compiledObject(data);
  },
};
