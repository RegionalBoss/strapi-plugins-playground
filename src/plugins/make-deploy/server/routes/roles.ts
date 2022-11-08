export default {
  type: "admin",
  routes: [
    {
      method: "GET",
      path: "/roles/:id",
      handler: "userspermissions.getRole",
      config: {
        description: "Retrieve a role depending on its id",
        tag: {
          plugin: "users-permissions",
          name: "Role",
          actionType: "findOne",
        },
      },
    },
    {
      method: "GET",
      path: "/roles",
      handler: "userspermissions.getRoles",
      config: {
        description: "Retrieve all role documents",
        tag: {
          plugin: "users-permissions",
          name: "Role",
          actionType: "find",
        },
      },
    },
  ],
};
