"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pluginId_1 = __importDefault(require("./pluginId"));
exports.default = ({ strapi }) => {
    // bootstrap phase
    const pluginStore = strapi.store({
        environment: "",
        type: "plugin",
        name: "menu",
    });
    const selectedDefaultContentType = "pages";
    const plugin = pluginId_1.default;
    // Check if content type Page exists
    const page_contentType = Object.entries(strapi.contentTypes).find(([_, value]) => value.collectionName === selectedDefaultContentType);
    if (!(page_contentType === null || page_contentType === void 0 ? void 0 : page_contentType[1])) {
        strapi.log.error(`collection '${selectedDefaultContentType}' is missing`);
        strapi.log.warn(`plugin '${plugin}' is disabled`);
    }
};
