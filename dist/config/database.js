"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
exports.default = ({ env }) => ({
    connection: {
        client: "sqlite",
        connection: {
            filename: path_1.default.join(__dirname, "..", "..", env("DATABASE_FILENAME", ".tmp/data.db")),
        },
        useNullAsDefault: true,
        // client: "postgres",
        // connection: {
        //   host: env("STRAPI_DB_HOST", "localhost"),
        //   port: env.int("STRAPI_DB_PORT", 5432),
        //   database: env("STRAPI_DB_NAME", "strapi4"),
        //   user: env("STRAPI_DB_USER", "strapi"),
        //   password: env("STRAPI_DB_PW", "strapipwd"),
        //   schema: env("STRAPI_DB_SCHEMA", "public"), // Not required
        //   ssl: env.bool("STRAPI_DB_SSL", false),
        // },
        // debug: false,
        // useNullAsDefault: true,
        // client: "postgres",
        // connection: {
        //   host: env("DATABASE_HOST", "localhost"),
        //   port: env.int("DATABASE_PORT", 5432),
        //   database: env("DATABASE_NAME", "playground"),
        //   user: env("DATABASE_USERNAME", "strapi"),
        //   password: env("DATABASE_PASSWORD", "strapipwd"),
        //   schema: env("DATABASE_SCHEMA", "public"), // Not required
        //   ssl: false,
        //   //  {
        //   //   rejectUnauthorized: env.bool("DATABASE_SSL_SELF", false),
        //   // },
        // },
        // debug: false,
    },
});
