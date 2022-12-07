"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ env }) => ({
    url: env("STRAPI_ACOUSTIC_NEWSLETTER_API", ""),
});
