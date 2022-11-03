"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => {
    Object.values(strapi.contentTypes).forEach((contentType) => {
        if (contentType.uid.includes("api::"))
            contentType.attributes.tasks = {
                type: "relation",
                relation: "morphMany",
                target: "plugin::todo.task",
                morphBy: "related",
                private: true,
                configurable: false,
            };
    });
};
