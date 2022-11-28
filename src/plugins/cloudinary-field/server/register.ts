import { Strapi } from "@strapi/strapi";
import pluginId from "./pluginId";

export default ({ strapi }: { strapi: Strapi }) => {
  // registeration phase
  strapi.customFields.register({
    name: "cloudinary",
    plugin: pluginId,
    type: "json",
  });
};
