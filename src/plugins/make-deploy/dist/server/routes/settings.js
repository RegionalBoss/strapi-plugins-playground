"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    type: "admin",
    routes: [
        {
            method: "GET",
            path: "/settings",
            handler: "settings.find",
            config: {
                policies: [
                    {
                        name: "admin::hasPermissions",
                        config: {
                            actions: ["plugin::make-deploy.read"],
                        },
                    },
                ],
            },
        },
        {
            method: "POST",
            path: "/settings",
            handler: "settings.create",
            config: {
                policies: [
                    {
                        name: "admin::hasPermissions",
                        config: {
                            actions: ["plugin::make-deploy.create"],
                        },
                    },
                ],
            },
        },
        {
            method: "PUT",
            path: "/settings/:id",
            handler: "settings.updateOne",
            config: {
                policies: [
                    {
                        name: "admin::hasPermissions",
                        config: {
                            actions: ["plugin::make-deploy.update"],
                        },
                    },
                ],
            },
        },
        {
            method: "DELETE",
            path: "/settings/:id",
            handler: "settings.deleteOne",
            config: {
                policies: [
                    {
                        name: "admin::hasPermissions",
                        config: {
                            actions: ["plugin::make-deploy.delete"],
                        },
                    },
                ],
            },
        },
    ],
};
