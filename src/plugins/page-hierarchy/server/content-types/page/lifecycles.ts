/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

import pluginId from "../../pluginId";

export default {
  beforeDelete: async ({ params }) => {
    const pageToDelete = await strapi
      .query(`plugin::${pluginId}.page`)
      .findOne(params);

    await strapi.query(`plugin::${pluginId}.audit-log`).create({
      data: {
        type: "PAGE",
        data_log: JSON.stringify(pageToDelete),
      },
    });
  },
};
