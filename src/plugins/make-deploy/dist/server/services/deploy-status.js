"use strict";
/**
 *  service
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
const pluginId_1 = __importDefault(require("../pluginId"));
exports.default = strapi_1.factories.createCoreService(`plugin::${pluginId_1.default}.deploy-status`);
