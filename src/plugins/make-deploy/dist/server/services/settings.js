"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pluginId_1 = __importDefault(require("../pluginId"));
const uuid_1 = require("uuid");
/**
 * settings service
 */
const STORE_CONFIG = {
    type: "plugin",
    environment: "",
    name: pluginId_1.default,
};
const STORE_KEY = "settings";
// Working with store as like LocalStorage, basically just a JSON written in database
const getPluginStore = () => strapi.store(STORE_CONFIG);
const populateId = (value) => ({
    ...value,
    id: (0, uuid_1.v4)(),
});
exports.default = ({ strapi }) => ({
    find: async () => getPluginStore().get({ key: STORE_KEY }),
    create: async (value) => {
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
    updateOne: async (id, value) => {
        const store = getPluginStore();
        const prev = (await store.get({ key: STORE_KEY })) || [];
        const next = prev.map((item) => item.id === id ? { ...item, ...value } : item);
        await store.set({ key: STORE_KEY, value: next });
        return store.get({ key: STORE_KEY });
    },
    deleteOne: async (id) => {
        const store = getPluginStore();
        const prev = (await store.get({ key: STORE_KEY })) || [];
        const next = prev.filter((item) => item.id !== id);
        await store.set({ key: STORE_KEY, value: next });
        return store.get({ key: STORE_KEY });
    },
});
