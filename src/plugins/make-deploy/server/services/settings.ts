import { Strapi } from "@strapi/strapi";
import pluginId from "../pluginId";
/**
 * settings service
 */

const STORE_CONFIG = {
  type: "plugin",
  environment: "",
  name: pluginId,
};
const STORE_KEY = "settings";

function getPluginStore() {
  return strapi.store(STORE_CONFIG);
}

export default ({ strapi }: { strapi: Strapi }) => ({
  find: async () => getPluginStore().get({ key: STORE_KEY }),
  create: async (value: unknown) => {
    const store = getPluginStore();
    await store.set({ key: STORE_KEY, value });
    return store.get({ key: STORE_KEY });
  },
});
