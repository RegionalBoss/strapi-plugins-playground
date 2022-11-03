"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => ({
    getWelcomeMessage() {
        return "Welcome to Strapi 🚀";
    },
    async getContentTypes() {
        const contentTypes = strapi.contentTypes;
        console.log("contentTypes", contentTypes);
        return Object.values(contentTypes).filter((el) => el.uid.includes("api::"));
    },
});
