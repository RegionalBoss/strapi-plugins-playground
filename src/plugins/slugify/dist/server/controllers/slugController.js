"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => ({
    index(ctx) {
        ctx.body = strapi
            .plugin("slugify")
            .service("slugService")
            .getWelcomeMessage();
    },
    async getContentTypes(ctx) {
        try {
            ctx.body = await strapi
                .plugin("slugify")
                .service("slugService")
                .getContentTypes();
        }
        catch (err) {
            ctx.throw(500, err);
        }
    },
    async setSlugs(ctx) {
        const { body, headers } = ctx.request;
        // console.log(headers)
        try {
            await strapi
                .plugin("slugify")
                .service("slugService")
                .setSlugs(body, headers);
            ctx.body = await strapi
                .plugin("slugify")
                .service("slugService")
                .getContentTypes();
        }
        catch (err) {
            ctx.throw(500, err);
        }
    },
});
