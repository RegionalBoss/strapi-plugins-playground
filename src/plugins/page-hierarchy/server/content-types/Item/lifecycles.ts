"use strict";

import pluginId from "../../pluginId";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

export default {
  beforeDelete: async ({ model }) => {
    const itemToDelete = await strapi
      .query(`plugin::${pluginId}.item`)
      .findOne({ where: { id: model.id } });

    await strapi.query(`plugin::${pluginId}.auditLog`).create({
      data: {
        type: "ITEM",
        data_log: JSON.stringify(itemToDelete),
      },
    });
  },
};
