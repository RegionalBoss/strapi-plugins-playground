"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = __importStar(require("lodash"));
exports.default = {
    async getRole(ctx) {
        const { id } = ctx.params;
        const { lang } = ctx.query;
        const plugins = await strapi.plugins["users-permissions"].services.userspermissions.getPlugins(lang);
        const role = await strapi.plugins["users-permissions"].services.userspermissions.getRole(id, plugins);
        if (_.isEmpty(role)) {
            return ctx.badRequest(null, [{ messages: [{ id: `Role don't exist` }] }]);
        }
        ctx.send({ role });
    },
    async getRoles(ctx) {
        try {
            const roles = await strapi.plugins["users-permissions"].services.userspermissions.getRoles();
            ctx.send({ roles });
        }
        catch (err) {
            ctx.badRequest(null, [{ messages: [{ id: "Not found" }] }]);
        }
    },
    async getRoutes(ctx) {
        try {
            const routes = await strapi.plugins["users-permissions"].services.userspermissions.getRoutes();
            ctx.send({ routes });
        }
        catch (err) {
            ctx.badRequest(null, [{ messages: [{ id: "Not found" }] }]);
        }
    },
};
