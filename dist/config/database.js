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
        //   host: env("DATABASE_HOST", "localhost"),
        //   port: env.int("DATABASE_PORT", 5432),
        //   database: env("DATABASE_NAME", "bank"),
        //   user: env("DATABASE_USERNAME", "postgres"),
        //   password: env("DATABASE_PASSWORD", "0000"),
        //   schema: env("DATABASE_SCHEMA", "public"), // Not required
        //   ssl: false,
        //   //  {
        //   //   rejectUnauthorized: env.bool("DATABASE_SSL_SELF", false),
        //   // },
        // },
        // debug: false,
    },
});
