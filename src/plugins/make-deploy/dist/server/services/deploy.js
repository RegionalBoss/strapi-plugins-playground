"use strict";
/**
 *  service
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pluginId_1 = __importDefault(require("../pluginId"));
const utils_1 = require("@strapi/utils");
exports.default = {
    /**
     * Promise to fetch all records
     *
     * @return {Promise}
     */
    find(params, populate) {
        console.log(strapi.query(`plugin::make-deploy.deploy`), "params", params);
        return strapi.query(`plugin::make-deploy.deploy`).findMany(params);
    },
    /**
     * Promise to fetch record
     *
     * @return {Promise}
     */
    findOne(params, populate) {
        return strapi.query(`plugin::${pluginId_1.default}.deploy`).findOne(params, populate);
    },
    /**
     * Promise to count record
     *
     * @return {Promise}
     */
    count(params) {
        return strapi.query(`plugin::${pluginId_1.default}.deploy`).count(params);
    },
    /**
     * Promise to search records
     *
     * @return {Promise}
     */
    search(params) {
        return strapi.query(`plugin::${pluginId_1.default}.deploy`).search(params);
    },
    /**
     * Promise to edit record
     *
     * @return {Promise}
     */
    async update(params, data, { files }) {
        const existingEntry = await strapi
            .query(`plugin::${pluginId_1.default}.deploy`)
            .findOne(params);
        const validData = await strapi.entityValidator.validateEntityUpdate(strapi.plugins[pluginId_1.default].models.deploy, data, {
            isDraft: utils_1.contentTypes.isDraft(existingEntry, strapi.plugins[pluginId_1.default].models.deploy),
        });
        const deployStatus_validData = await strapi.entityValidator.validateEntityCreation(strapi.plugins[pluginId_1.default].models.deployStatus, {
            message: data.message,
            status: data.status,
            stage: data.stage,
            deploy: { id: params.id },
        }, {
            isDraft: utils_1.contentTypes.isDraft(data, strapi.plugins[pluginId_1.default].models.deploy),
        });
        await strapi
            .query(`plugin::${pluginId_1.default}.deployStatus`)
            .create(deployStatus_validData);
        const entry = await strapi
            .query(`plugin::${pluginId_1.default}.deploy`)
            .update(params, validData);
        if (files) {
            // automatically uploads the files based on the entry and the model
            await strapi.entityService.uploadFiles(entry, files, {
                model: "deploy",
                source: pluginId_1.default,
            });
            return this.findOne({ id: entry.id });
        }
        return entry;
    },
};
