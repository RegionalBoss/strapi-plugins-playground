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
        // policies: [["admin::hasPermissions", ["plugins::make-deploy.read"]]],
      },
    },
    {
      method: "GET",
      path: "/deploy/:id",
      handler: "deploy.findOne",
      config: {
        // policies: [["admin::hasPermissions", ["plugins::make-deploy.read"]]],
      },
    },
    {
      method: "POST",
      path: "/deploy",
      handler: "deploy.startNewDeploy",
      config: {},
    },
  ],
};
