"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getPluginStore() {
    return strapi.store({
        environment: "",
        type: "plugin",
        name: "todo",
    });
}
async function createDefaultConfig() {
    const pluginStore = getPluginStore();
    const value = {
        disabled: false,
    };
    await pluginStore.set({ key: "settings", value });
    return pluginStore.get({ key: "settings" });
}
exports.default = ({ strapi }) => ({
    count: async () => await strapi.query("plugin::todo.task").count(),
    async getSettings() {
        const pluginStore = getPluginStore();
        let config = await pluginStore.get({ key: "settings" });
        if (!config) {
            config = await createDefaultConfig();
        }
        return config;
    },
    async setSettings(settings) {
        const value = settings;
        const pluginStore = getPluginStore();
        await pluginStore.set({ key: "settings", value });
        return pluginStore.get({ key: "settings" });
    },
});
