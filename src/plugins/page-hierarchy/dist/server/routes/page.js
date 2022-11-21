"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    type: "admin",
    routes: [
        {
            method: "GET",
            path: "/pages/:id",
            handler: "page.findOne",
            config: {},
        },
        {
            method: "GET",
            path: "/flat-pages",
            handler: "page.flatFind",
            config: {},
        },
        {
            method: "GET",
            path: "/pages",
            handler: "page.find",
            config: {
                auth: false,
            },
        },
    ],
};
