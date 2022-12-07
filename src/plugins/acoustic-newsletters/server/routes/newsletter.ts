export default {
  type: "admin",
  routes: [
    {
      method: "GET",
      path: "/",
      handler: "newsletter.find",
      config: {
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/getAcousticNewsletterConfig",
      handler: "newsletter.getAcousticNewsletterConfig",
      config: {
        policies: [],
      },
    },
    {
      method: "POST",
      path: "/setIsSended",
      handler: "newsletter.setIsSended",
      config: {
        policies: [],
      },
    },
  ],
};
