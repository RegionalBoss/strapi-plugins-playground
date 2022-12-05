export const admin = {
  type: "admin",
  routes: [
    {
      method: "GET",
      path: "/flat-items",
      handler: "item.flatFind",
    },
    {
      method: "PUT",
      path: "/items",
      handler: "item.updateItems",
    },
  ],
};

export const contentApi = {
  type: "content-api",
  routes: [
    {
      method: "GET",
      path: "/items",
      handler: "item.find",
    },
    {
      method: "GET",
      path: "/items/:id",
      handler: "item.findOne",
    },
  ],
};

export default {
  admin,
  contentApi,
};
