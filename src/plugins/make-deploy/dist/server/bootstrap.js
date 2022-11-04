"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pluginId_1 = __importDefault(require("./pluginId"));
exports.default = async ({ strapi }) => {
    // bootstrap phase
    const pluginStore = strapi.store({
        type: "plugin",
        name: pluginId_1.default,
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
    if (strapi.admin.services.permission.actionProvider.registerMany ===
        undefined) {
        await strapi.admin.services.permission.actionProvider.register(actions);
    }
    else {
        await strapi.admin.services.permission.actionProvider.registerMany(actions);
    }
};
