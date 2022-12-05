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
    await strapi.admin.services.permission.actionProvider.registerMany(actions);
};
