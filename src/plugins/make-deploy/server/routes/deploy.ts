/**
 *  router
 */

export default {
  type: "admin",
  routes: [
    {
      method: "GET",
      path: "/deploy",
      handler: "deploy.find",
      config: {
        policies: [
          {
            name: "admin::hasPermissions",
            config: {
              actions: ["plugin::make-deploy.read"],
            },
          },
        ],
      },
    },
    {
      method: "GET",
      path: "/deploy/:id",
      handler: "deploy.findOne",
      config: {
        policies: [
          {
            name: "admin::hasPermissions",
            config: {
              actions: ["plugin::make-deploy.read"],
            },
          },
        ],
      },
    },
    {
      method: "GET",
      path: "/deploy/count",
      handler: "deploy.count",
      config: {
        policies: [
          {
            name: "admin::hasPermissions",
            config: {
              actions: ["plugin::make-deploy.read"],
            },
          },
        ],
      },
    },
    {
      method: "POST",
      path: "/deploy",
      handler: "deploy.startNewDeploy",
      config: {
        policies: [
          {
            name: "admin::hasPermissions",
            config: {
              actions: ["plugin::make-deploy.create"],
            },
          },
        ],
      },
    },
    {
      method: "PUT",
      path: "/deploy/:id",
      handler: "deploy.update",
      config: {
        policies: [
          {
            name: "admin::hasPermissions",
            config: {
              actions: ["plugin::make-deploy.update"],
            },
          },
        ],
      },
    },
  ],
};
