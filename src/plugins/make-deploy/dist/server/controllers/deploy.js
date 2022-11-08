"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pluginId_1 = __importDefault(require("../pluginId"));
const deploy_1 = require("../validators/deploy");
const SERVICE = "deploy";
exports.default = {
    /**
     * Retrieve records.
     *
     * @return {Array}
     */
    async find(ctx) {
        const entities = ctx.query._q
            ? await strapi.plugin(pluginId_1.default).service(SERVICE).search(ctx.query)
            : await strapi.plugin(pluginId_1.default).service(SERVICE).find(ctx.query);
        return entities;
    },
    /**
     * Retrieve a record.
     *
     * @return {Object}
     */
    async findOne(ctx) {
        const { id } = ctx.params;
        const entity = await strapi.plugin(pluginId_1.default).service(SERVICE).findOne({
            id,
        });
        return entity;
    },
    /**
     * Count records.
     *
     * @return {Number}
     */
    count(ctx) {
        if (ctx.query._q) {
            return strapi.plugin(pluginId_1.default).service(SERVICE).countSearch(ctx.query);
        }
        return strapi.plugin(pluginId_1.default).service(SERVICE).count(ctx.query);
    },
    async startNewDeploy(ctx) {
        const userObject = {
            createdBy: ctx.state.user,
            updatedBy: ctx.state.user,
        };
        const createDeployBody = {
            ...ctx.request.body,
            ...userObject,
        };
        const { error } = await (0, deploy_1.validateCreateDeploy)(createDeployBody);
        if (error)
            return ctx.badRequest("ValidationError", { errors: error });
        return strapi
            .plugin(pluginId_1.default)
            .service(SERVICE)
            .startNewDeploy(createDeployBody, ctx.state.user);
    },
};
