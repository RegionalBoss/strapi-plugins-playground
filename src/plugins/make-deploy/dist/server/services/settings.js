"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pluginId_1 = __importDefault(require("../pluginId"));
/**
 * settings service
 */
const STORE_CONFIG = {
    type: "plugin",
    environment: "",
    name: pluginId_1.default,
};
const STORE_KEY = "settings";
function getPluginStore() {
    return strapi.store(STORE_CONFIG);
}
exports.default = ({ strapi }) => ({
    find: async () => getPluginStore().get({ key: STORE_KEY }),
    create: async (value) => {
        const store = getPluginStore();
        await store.set({ key: STORE_KEY, value });
        return store.get({ key: STORE_KEY });
    },
});
