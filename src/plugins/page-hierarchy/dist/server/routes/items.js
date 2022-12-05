"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentApi = exports.admin = void 0;
exports.admin = {
    type: "admin",
    routes: [
        {
            method: "GET",
            path: "/flat-items",
            handler: "item.flatFind",
        },
        {
            method: "PUT",
            path: "/items",
            handler: "item.updateItems",
        },
    ],
};
exports.contentApi = {
    type: "content-api",
    routes: [
        {
            method: "GET",
            path: "/items",
            handler: "item.find",
        },
        {
            method: "GET",
            path: "/items/:id",
            handler: "item.findOne",
        },
    ],
};
exports.default = {
    admin: exports.admin,
    contentApi: exports.contentApi,
};
