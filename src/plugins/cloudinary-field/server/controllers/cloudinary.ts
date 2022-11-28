import { Strapi } from "@strapi/strapi";

import { createHash } from "crypto";

export default ({ strapi }: { strapi: Strapi }) => ({
  config(ctx) {
    const { username, apiSecret, cloudName, apiKey } = strapi.config.get(
      "cloudinary",
      {
        username: "",
        apiSecret: "",
        cloudName: "",
        apiKey: "",
      }
    );

    const timestamp = Date.now();
    const hash = createHash("sha256");
    hash.update(
      `cloud_name=${cloudName}&timestamp=${timestamp}&username=${username}${apiSecret}`
    );
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
