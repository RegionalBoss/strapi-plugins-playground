export default {
  type: "admin",
  routes: [
    {
      method: "GET",
      path: "/settings",
      handler: "settings.find",
      config: {},
    },
    {
      method: "POST",
      path: "/settings",
      handler: "settings.create",
      config: {},
    },
    {
      method: "PUT",
      path: "/settings/:id",
      handler: "settings.updateOne",
      config: {},
    },
    {
      method: "DELETE",
      path: "/settings/:id",
      handler: "settings.deleteOne",
      config: {},
    },
  ],
};
