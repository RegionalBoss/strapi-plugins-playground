import { Strapi } from "@strapi/strapi";
import pluginId from "./pluginId";

export default async ({ strapi }: { strapi: Strapi }) => {
  // bootstrap phase
  const pluginStore = strapi.store({
    type: "plugin",
    name: pluginId,
    key: "settings",
  });

  await pluginStore.get();
};
