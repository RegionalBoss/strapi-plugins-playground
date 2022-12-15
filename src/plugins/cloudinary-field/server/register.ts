import { Strapi } from "@strapi/strapi";

export default ({ strapi }: { strapi: Strapi }) => {
  // registeration phase
  strapi.customFields.register({
    name: "cloudinary",
    plugin: "cloudinary-field",
    type: "json",
  });
};
