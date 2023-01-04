"use strict";
/**
 * A set of functions called "actions" for `settings`
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pluginId_1 = __importDefault(require("../pluginId"));
const settings_1 = require("../validators/settings");
exports.default = {
    find: async (ctx) => {
        try {
            ctx.body = await strapi.plugin(pluginId_1.default).service("settings").find();
        }
        catch (err) {
            ctx.throw(500, err);
        }
    },
    create: async (ctx) => {
        const { body } = ctx.request;
        const { error } = await (0, settings_1.validateSettings)(body);
        if (error)
            return ctx.badRequest("ValidationError", { errors: error });
        try {
            ctx.body = await strapi.plugin(pluginId_1.default).service("settings").create(body);
        }
        catch (err) {
            ctx.throw(500, err);
        }
    },
    updateOne: async (ctx) => {
        const { body } = ctx.request;
        const { error } = await (0, settings_1.validateSettings)(body);
        if (error)
            return ctx.badRequest("ValidationError", { errors: error });
        try {
            ctx.body = await strapi
                .plugin(pluginId_1.default)
                .service("settings")
                .updateOne(ctx.params.id, body);
        }
        catch (err) {
            ctx.throw(500, err);
        }
    },
    deleteOne: async (ctx) => {
        try {
            ctx.body = await strapi
                .plugin(pluginId_1.default)
                .service("settings")
                .deleteOne(ctx.params.id);
        }
        catch (err) {
            ctx.throw(500, err);
        }
    },
    // exampleAction: async (ctx, next) => {
    //   try {
    //     ctx.body = 'ok';
    //   } catch (err) {
    //     ctx.body = err;
    //   }
    // }
};
