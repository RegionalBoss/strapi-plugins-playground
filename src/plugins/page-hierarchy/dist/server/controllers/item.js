"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pluginId_1 = __importDefault(require("../pluginId"));
const utils_1 = require("../utils");
const utils_2 = require("@strapi/utils");
const service = () => strapi.plugin(pluginId_1.default).service("item");
const transformDbItems = (dbItem) => ({
    ...(0, utils_1.convertKeysFromSnakeCaseToCamelCase)(dbItem),
    // TODO: refactor frontend or DB for consistent flow
    parentId: dbItem.parent_item,
    pageId: dbItem.page,
});
// TODO:
// > add data validations?
// > add cascade deleting?
// > add authorization + authentication
// > add sanitizeEntity
exports.default = {
    // flat prefix mean that the endpoint returns only item table data (not components etc...)
    // fetch data without nested data joins created by Content-Types Builder
    flatFind: async () => (await service().flatFind()).map(transformDbItems),
    find: async (ctx) => {
        const items = await service().find(ctx.query);
        // console.log(strapi.getModel(`plugin::${pluginId}.item`), ctx.query, items);
        // console.log(strapi.plugin(pluginId).contentTypes);
        return Promise.all(items.map(async (entity) => await utils_2.sanitize.contentAPI.output(entity, strapi.getModel(`plugin::${pluginId_1.default}.item`))));
    },
    findOne: async (ctx) => await utils_2.sanitize.contentAPI.output(await service().findOne(ctx.params.id), strapi.getModel(`plugin::${pluginId_1.default}.item`)),
    updateItems: async (ctx) => {
        const trx = await strapi.db.connection.transaction();
        try {
            const body = ctx.request.body;
            const bodyItems = body.items;
            const bodyPages = body.pages;
            return service().updateItems(bodyItems, bodyPages, trx);
        }
        catch (err) {
            console.error(err);
            ctx.status = 500;
            if (trx && !trx.isCompleted()) {
                await trx.rollback();
            }
            return err.toString();
        }
    },
};
