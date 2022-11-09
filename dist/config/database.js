"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ env }) => ({
    connection: {
        // client: "sqlite",
        // connection: {
        //   filename: path.join(
        //     __dirname,
        //     "..",
        //     "..",
        //     env("DATABASE_FILENAME", ".tmp/data.db")
        //   ),
        // },
        // useNullAsDefault: true,
        client: "postgres",
        connection: {
            host: env("DATABASE_HOST", "localhost"),
            port: env.int("DATABASE_PORT", 5432),
            database: env("DATABASE_NAME", "bank"),
            user: env("DATABASE_USERNAME", "postgres"),
            password: env("DATABASE_PASSWORD", "0000"),
            schema: env("DATABASE_SCHEMA", "public"),
            ssl: false,
            //  {
            //   rejectUnauthorized: env.bool("DATABASE_SSL_SELF", false),
            // },
        },
        debug: false,
    },
});
