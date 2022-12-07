"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pluginId_1 = __importDefault(require("../pluginId"));
exports.default = {
    setIsSended: async (ctx) => {
        const body = ctx.request.body;
        try {
            const res = await strapi
                .entityService(`plugin::${pluginId_1.default}.newsletter`)
                .update(body.id, {
                data: {
                    isSended: true,
                },
            });
            return res;
        }
        catch (err) {
            console.log(err);
            throw new Error(err.toString());
        }
    },
    getAcousticNewsletterConfig: (ctx) => {
        const data = strapi.config.acousticNewsletters;
        ctx.body = data;
    },
    find: async (ctx) => {
        return strapi.entityService.findMany(`plugin::${pluginId_1.default}.newsletter`, {
            populate: "*",
        });
    },
};
