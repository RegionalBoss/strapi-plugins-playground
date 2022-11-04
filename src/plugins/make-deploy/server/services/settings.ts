import { Strapi } from "@strapi/strapi";
import pluginId from "../pluginId";
import { v4 as uuid4 } from "uuid";
/**
 * settings service
 */

const STORE_CONFIG = {
  type: "plugin",
  environment: "",
  name: pluginId,
};
const STORE_KEY = "settings";

// Working with store as like LocalStorage, basically just a JSON written in database
const getPluginStore = () => strapi.store(STORE_CONFIG);

const populateId = (value: Record<string, unknown>) => ({
  ...value,
  id: uuid4(),
});

export default ({ strapi }: { strapi: Strapi }) => ({
  find: async () => getPluginStore().get({ key: STORE_KEY }),

  create: async (value: Record<string, unknown>) => {
    const store = getPluginStore();
    const prev = (await store.get({ key: STORE_KEY })) || [];
    console.log("prev", prev);
    await store.set({
      key: STORE_KEY,
      value: [
        ...prev,
        ...(Array.isArray(value) ? value.map(populateId) : [populateId(value)]),
      ],
    });

    return store.get({ key: STORE_KEY });
  },

  updateOne: async (id: string, value: Record<string, unknown>) => {
    const store = getPluginStore();
    const prev = (await store.get({ key: STORE_KEY })) || [];
    const next = prev.map((item: Record<string, unknown>) =>
      item.id === id ? { ...item, ...value } : item
    );
    await store.set({ key: STORE_KEY, value: next });

    return store.get({ key: STORE_KEY });
  },
  deleteOne: async (id: string) => {
    const store = getPluginStore();
    const prev = (await store.get({ key: STORE_KEY })) || [];
    const next = prev.filter((item: Record<string, unknown>) => item.id !== id);
    await store.set({ key: STORE_KEY, value: next });

    return store.get({ key: STORE_KEY });
  },
});
