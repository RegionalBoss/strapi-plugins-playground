"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    type: "admin",
    routes: [
        {
            method: "GET",
            path: "/roles/:id",
            handler: "userspermissions.getRole",
            config: {
                policies: [
                    {
                        name: "admin::hasPermissions",
                        config: {
                            actions: ["plugin::users-permissions.roles.read"],
                        },
                    },
                ],
                description: "Retrieve a role depending on its id",
                tag: {
                    plugin: "users-permissions",
                    name: "Role",
                    actionType: "findOne",
                },
            },
        },
        {
            method: "GET",
            path: "/roles",
            handler: "userspermissions.getRoles",
            config: {
                policies: [
                    {
                        name: "admin::hasPermissions",
                        config: {
                            actions: ["plugin::users-permissions.roles.read"],
                        },
                    },
                ],
                description: "Retrieve all role documents",
                tag: {
                    plugin: "users-permissions",
                    name: "Role",
                    actionType: "find",
                },
            },
        },
    ],
};
