"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.admin = exports.contentApi = void 0;
exports.contentApi = {
    type: "content-api",
    routes: [
        {
            method: "GET",
            path: "/pages/:id",
            handler: "page.findOne",
        },
        {
            method: "GET",
            path: "/pages",
            handler: "page.find",
        },
    ],
};
exports.admin = {
    type: "admin",
    routes: [
        {
            method: "GET",
            path: "/flat-pages",
            handler: "page.flatFind",
        },
    ],
};
exports.default = {
    contentApi: exports.contentApi,
    admin: exports.admin,
};
