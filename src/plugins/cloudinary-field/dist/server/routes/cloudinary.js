"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    type: "admin",
    routes: [
        {
            method: "GET",
            path: "/config",
            handler: "cloudinary.config",
            config: {
                auth: false,
            },
        },
    ],
};
