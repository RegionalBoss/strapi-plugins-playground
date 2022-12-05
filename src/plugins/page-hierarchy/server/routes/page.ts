export const contentApi = {
  type: "content-api",
  routes: [
    {
      method: "GET",
      path: "/pages/:id",
      handler: "page.findOne",
    },
    {
      method: "GET",
      path: "/pages",
      handler: "page.find",
    },
  ],
};

export const admin = {
  type: "admin",
  routes: [
    {
      method: "GET",
      path: "/flat-pages",
      handler: "page.flatFind",
    },
  ],
};

export default {
  contentApi,
  admin,
};
