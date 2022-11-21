"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    type: "admin",
    routes: [
        {
            method: "GET",
            path: "/items",
            handler: "item.find",
            config: {
                auth: false,
            },
        },
        {
            method: "GET",
            path: "/items/:id",
            handler: "item.findOne",
            config: {},
        },
        {
            method: "GET",
            path: "/flat-items",
            handler: "item.flatFind",
            config: {
                auth: false,
            },
        },
        {
            method: "PUT",
            path: "/items",
            handler: "item.updateItems",
            config: {},
        },
    ],
};
