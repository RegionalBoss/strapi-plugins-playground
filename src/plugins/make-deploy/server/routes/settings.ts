export default {
  type: "admin",
  routes: [
    {
      method: "GET",
      path: "/settings",
      handler: "settings.find",
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/settings",
      handler: "settings.create",
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: "PUT",
      path: "/settings/:id",
      handler: "settings.updateOne",
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: "DELETE",
      path: "/settings/:id",
      handler: "settings.deleteOne",
      config: {
        policies: [],
        auth: false,
      },
    },
  ],
};
