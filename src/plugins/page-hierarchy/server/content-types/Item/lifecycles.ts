"use strict";

import pluginId from "../../pluginId";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

export default {
  beforeDelete: async (params) => {
    const itemToDelete = await strapi
      .query(`plugin::${pluginId}.item`)
      .findOne(params);

    await strapi.query(`plugin::${pluginId}.audit-log`).create({
      data: {
        type: "ITEM",
        data_log: JSON.stringify(itemToDelete),
      },
    });
  },
};
