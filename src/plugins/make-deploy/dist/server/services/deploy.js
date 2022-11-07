"use strict";
/**
 *  service
 */
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const https = __importStar(require("https"));
const axios_1 = __importDefault(require("axios"));
const pluginId_1 = __importDefault(require("../pluginId"));
const utils_1 = require("@strapi/utils");
const deploy_status_1 = require("../validators/deploy-status");
const { ApplicationError, ValidationError } = utils_1.errors;
const MODEL_NAME = "deploy";
exports.default = {
    /**
     * Promise to fetch all records
     *
     * @return {Promise}
     */
    find(params, populate) {
        return strapi.query(`plugin::${pluginId_1.default}.${MODEL_NAME}`).findMany(params);
    },
    /**
     * Promise to fetch record
     *
     * @return {Promise}
     */
    findOne(params, populate) {
        return strapi
            .query(`plugin::${pluginId_1.default}.${MODEL_NAME}`)
            .findOne(params, populate);
    },
    /**
     * Promise to count record
     *
     * @return {Promise}
     */
    count(params) {
        return strapi.query(`plugin::${pluginId_1.default}.${MODEL_NAME}`).count(params);
    },
    /**
     * Promise to search records
     *
     * @return {Promise}
     */
    search(params) {
        return strapi.query(`plugin::${pluginId_1.default}.${MODEL_NAME}`).search(params);
    },
    startNewDeploy: async (data, user) => {
        var _a, _b, _c, _d, _e, _f;
        console.log(`STRAPI: plugin::${pluginId_1.default}.${MODEL_NAME} -`, strapi.query(`plugin::${pluginId_1.default}.${MODEL_NAME}`));
        const settings = await strapi
            .plugin(pluginId_1.default)
            .service("settings")
            .find();
        const currentSetting = settings.find((s) => s.name === data.name);
        if (!currentSetting)
            throw new ApplicationError("Odpovídající nastaveni nebylo nalezeno");
        const notFinalItems = await strapi
            .plugin(pluginId_1.default)
            .service(MODEL_NAME)
            .find({
            orderBy: { createdAt: "DESC" },
            where: { isFinal: false, name: data.name },
        });
        if ((notFinalItems === null || notFinalItems === void 0 ? void 0 : notFinalItems.length) > 0)
            throw new ApplicationError("Some previous build has isFinal: false");
        console.log("CREATE DEPLOY: ", data);
        const createDeploy = await strapi
            .query(`plugin::${pluginId_1.default}.${MODEL_NAME}`)
            .create({
            data: {
                name: data.name,
                isFinal: data.isFinal,
            },
        });
        console.log("CREATED DEPLOY: ", createDeploy);
        const createStatusMessageBody_init = {
            deploy: { id: createDeploy.id },
            message: data.message,
            stage: data.stage,
            status: data.status,
            createdBy: typeof data.createdBy === "number"
                ? data.createdBy
                : (_a = data.createdBy) === null || _a === void 0 ? void 0 : _a.id,
            updatedBy: typeof data.updatedBy === "number"
                ? data.updatedBy
                : (_b = data.updatedBy) === null || _b === void 0 ? void 0 : _b.id,
        };
        const { error } = await (0, deploy_status_1.validateDeployStatus)(createStatusMessageBody_init);
        if (error)
            throw new ValidationError(error);
        const createStatusMessage_init = await strapi
            .query(`plugin::${pluginId_1.default}.deploy-status`)
            .create({ data: createStatusMessageBody_init });
        console.log("CREATE DEPLOY STATUS MESSAGE INIT RESPONSE: ", createStatusMessage_init);
        try {
            const { data: externalServiceResponse } = await (0, axios_1.default)(currentSetting.deploy, {
                params: {
                    release: createDeploy.id,
                },
                httpsAgent: new https.Agent({
                    rejectUnauthorized: false,
                }),
                headers: {
                    "x-user": user === null || user === void 0 ? void 0 : user.username,
                    authorization: process.env.DEPLOY_AUTHORIZATION || "",
                },
            });
            console.log("EXTERNAL SERVICE RESPONSE: ", externalServiceResponse);
            await strapi.query(`plugin::${pluginId_1.default}.deploy-status`).create({
                data: {
                    message: "Spuštěno sestavení aplikace",
                    stage: "BE Strapi",
                    status: "info",
                    deploy: { id: createDeploy.id },
                    createdBy: typeof data.createdBy === "number"
                        ? data.createdBy
                        : (_c = data.createdBy) === null || _c === void 0 ? void 0 : _c.id,
                    updatedBy: typeof data.updatedBy === "number"
                        ? data.updatedBy
                        : (_d = data.updatedBy) === null || _d === void 0 ? void 0 : _d.id,
                },
            });
        }
        catch (error) {
            if (error.response) {
                // Request made and server responded
                console.warn("error.response", error.response);
                console.warn("error.request.headers:::", error.request);
            }
            else if (error.request)
                // The request was made but no response was received
                console.warn("error.request", error.request);
            // Something happened in setting up the request that triggered an Error
            else
                console.warn("error.message", error.message);
            await strapi.query(`plugin::${pluginId_1.default}.deploy-status`).create({
                data: {
                    message: `Nebylo možné spustit sestavení aplikace: ${error.message}`,
                    stage: "BE Strapi",
                    status: "error",
                    deploy: { id: createDeploy.id },
                    createdBy: typeof data.createdBy === "number"
                        ? data.createdBy
                        : (_e = data.createdBy) === null || _e === void 0 ? void 0 : _e.id,
                    updatedBy: typeof data.updatedBy === "number"
                        ? data.updatedBy
                        : (_f = data.updatedBy) === null || _f === void 0 ? void 0 : _f.id,
                },
            });
            const updatedBody = {
                isFinal: true,
            };
            return await strapi
                .query(`plugin::${pluginId_1.default}.${MODEL_NAME}`)
                .update({ where: { id: createDeploy.id }, data: updatedBody });
        }
        return createDeploy;
    },
};
