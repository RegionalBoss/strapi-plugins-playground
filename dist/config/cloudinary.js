"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ env }) => ({
    cloudName: env("STRAPI_CLOUDINARY_CLOUDNAME", ""),
    username: env("STRAPI_CLOUDINARY_USERNAME", ""),
    apiKey: env("STRAPI_CLOUDINARY_APIKEY", ""),
    apiSecret: env("STRAPI_CLOUDINARY_APISECRET", ""),
});
