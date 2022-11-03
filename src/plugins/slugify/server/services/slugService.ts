import { Strapi } from "@strapi/strapi";

export default ({ strapi }: { strapi: Strapi }) => ({
  getWelcomeMessage() {
    return "Welcome to Strapi 🚀";
  },
  async getContentTypes() {
    const contentTypes = strapi.contentTypes;
    console.log("contentTypes", contentTypes);
    return Object.values(contentTypes).filter((el: any) =>
      el.uid.includes("api::")
    );
  },
});
