"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pluginId_1 = __importDefault(require("./pluginId"));
exports.default = ({ strapi }) => {
    // registeration phase
    strapi.customFields.register({
        name: "cloudinary",
        plugin: pluginId_1.default,
        type: "json",
    });
};
