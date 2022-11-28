"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
exports.default = ({ strapi }) => ({
    config(ctx) {
        const { username, apiSecret, cloudName, apiKey } = strapi.config.get("cloudinary", {
            username: "",
            apiSecret: "",
            cloudName: "",
            apiKey: "",
        });
        const timestamp = Date.now();
        const hash = (0, crypto_1.createHash)("sha256");
        hash.update(`cloud_name=${cloudName}&timestamp=${timestamp}&username=${username}${apiSecret}`);
        const signature = hash.digest("hex");
        // Send 200 `ok`
        ctx.send({
            message: "ok",
            body: {
                cloudinary: {
                    cloud_name: cloudName,
                    api_key: apiKey,
                    username,
                    timestamp,
                    signature,
                },
            },
        });
    },
});
