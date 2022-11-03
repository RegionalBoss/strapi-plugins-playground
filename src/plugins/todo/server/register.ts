import { Strapi } from "@strapi/strapi";

export default ({ strapi }: { strapi: Strapi }) => {
  Object.values(strapi.contentTypes).forEach((contentType: any) => {
    if (contentType.uid.includes("api::"))
      contentType.attributes.tasks = {
        type: "relation",
        relation: "morphMany",
        target: "plugin::todo.task",
        morphBy: "related",
        private: true,
        configurable: false,
      };
  });
};
