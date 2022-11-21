import { Strapi } from "@strapi/strapi";
import pluginId from "./pluginId";

export default ({ strapi }: { strapi: Strapi }) => {
  // bootstrap phase
  const pluginStore = strapi.store({
    environment: "",
    type: "plugin",
    name: "menu",
  });

  const selectedDefaultContentType = "pages";
  const plugin = pluginId;

  // Check if content type Page exists
  const page_contentType = Object.entries(strapi.contentTypes).find(
    ([_, value]) => (value as any).collectionName === selectedDefaultContentType
  );

  if (!page_contentType?.[1]) {
    strapi.log.error(`collection '${selectedDefaultContentType}' is missing`);
    strapi.log.warn(`plugin '${plugin}' is disabled`);
  }
};
