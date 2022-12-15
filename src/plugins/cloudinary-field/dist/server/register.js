"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => {
    // registeration phase
    strapi.customFields.register({
        name: "cloudinary",
        plugin: "cloudinary-field",
        type: "json",
    });
};
