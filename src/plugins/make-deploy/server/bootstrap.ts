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
      displayName: "Count",
      uid: "count",
      pluginName: "make-deploy",
    },
    {
      section: "plugins",
      displayName: "findOne",
      uid: "find-one",
      pluginName: "make-deploy",
    },
    {
      section: "plugins",
      displayName: "find",
      uid: "find",
      pluginName: "make-deploy",
    },
    {
      section: "plugins",
      displayName: "Update",
      uid: "update",
      pluginName: "make-deploy",
    },
    {
      section: "plugins",
      displayName: "Create",
      uid: "create",
      pluginName: "make-deploy",
    },
    {
      section: "plugins",
      displayName: "Delete",
      uid: "delete",
      pluginName: "make-deploy",
    },
  ];

  await (strapi as any).admin.services.permission.actionProvider.registerMany(
    actions
  );
};
