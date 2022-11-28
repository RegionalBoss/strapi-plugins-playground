export default {
  type: "admin",
  routes: [
    {
      method: "GET",
      path: "/config",
      handler: "cloudinary.config",
      config: {
        policies: [],
      },
    },
  ],
};
