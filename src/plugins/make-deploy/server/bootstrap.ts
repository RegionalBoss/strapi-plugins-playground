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

  const actions = [
    {
      section: "plugins",
      displayName: "Read",
      uid: "read",
      pluginName: "make-deploy",
    },
    {
      section: "plugins",
      displayName: "Update",
      uid: "update",
      pluginName: "make-deploy",
    },
  ];

  // hack for different strapi versions
  // 3.4.6 is missing method registerMany
  if (
    (strapi as any).admin.services.permission.actionProvider.registerMany ===
    undefined
  ) {
    await (strapi as any).admin.services.permission.actionProvider.register(
      actions
    );
  } else {
    await (strapi as any).admin.services.permission.actionProvider.registerMany(
      actions
    );
  }
};
