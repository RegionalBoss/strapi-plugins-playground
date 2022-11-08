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
};
