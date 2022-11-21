"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pluginId_1 = __importDefault(require("../pluginId"));
const utils_1 = require("../utils");
exports.default = {
    findOne: async (ctx) => {
        const { id } = ctx.params;
        return strapi.entityService.findOne(`plugin::${pluginId_1.default}.page`, id);
    },
    // flat prefix mean that the endpoint returns only item table data (not components etc...)
    flatFind: async (ctx) => {
        // I don't want to send collection-Types builder attributes
        const data = await strapi.entityService.findMany(`plugin::${pluginId_1.default}.page`);
        console.log("pages flat find", data);
        return (data
            // todo: add sanitizeEntity
            // .map(p => sanitizeEntity(p, { model: global.strapi.models.page }))
            .map(utils_1.convertKeysFromSnakeCaseToCamelCase));
    },
    find: async (ctx) => {
        return strapi.entityService.findMany(`plugin::${pluginId_1.default}.page`);
    },
};
