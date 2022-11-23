"use strict";
/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pluginId_1 = __importDefault(require("../../pluginId"));
exports.default = {
    beforeDelete: async ({ params }) => {
        const pageToDelete = await strapi
            .query(`plugin::${pluginId_1.default}.page`)
            .findOne(params);
        await strapi.query(`plugin::${pluginId_1.default}.audit-log`).create({
            data: {
                type: "PAGE",
                data_log: JSON.stringify(pageToDelete),
            },
        });
    },
};
