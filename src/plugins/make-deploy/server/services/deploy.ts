/**
 *  service
 */

import pluginId from "../pluginId";
import { contentTypes } from "@strapi/utils";

export default {
  /**
   * Promise to fetch all records
   *
   * @return {Promise}
   */
  find(params, populate): Promise<any> {
    console.log(strapi.query(`plugin::make-deploy.deploy`));
    return strapi
      .query(`plugin::make-deploy.deploy`)
      .findPage(params, populate);
  },

  /**
   * Promise to fetch record
   *
   * @return {Promise}
   */
  findOne(params, populate): Promise<any> {
    return strapi.query(`plugin::${pluginId}.deploy`).findOne(params, populate);
  },

  /**
   * Promise to count record
   *
   * @return {Promise}
   */
  count(params) {
    return strapi.query(`plugin::${pluginId}.deploy`).count(params);
  },

  /**
   * Promise to search records
   *
   * @return {Promise}
   */
  search(params) {
    return strapi.query(`plugin::${pluginId}.deploy`).search(params);
  },

  /**
   * Promise to edit record
   *
   * @return {Promise}
   */

  async update(params, data, { files }) {
    const existingEntry = await strapi
      .query(`plugin::${pluginId}.deploy`)
      .findOne(params);

    const validData = await strapi.entityValidator.validateEntityUpdate(
      strapi.plugins[pluginId].models.deploy,
      data,
      {
        isDraft: contentTypes.isDraft(
          existingEntry,
          strapi.plugins[pluginId].models.deploy
        ),
      }
    );

    const deployStatus_validData =
      await strapi.entityValidator.validateEntityCreation(
        strapi.plugins[pluginId].models.deployStatus,
        {
          message: data.message,
          status: data.status,
          stage: data.stage,
          deploy: { id: params.id },
        },
        {
          isDraft: contentTypes.isDraft(
            data,
            strapi.plugins[pluginId].models.deploy
          ),
        }
      );

    await strapi
      .query(`plugin::${pluginId}.deployStatus`)
      .create(deployStatus_validData);

    const entry = await strapi
      .query(`plugin::${pluginId}.deploy`)
      .update(params, validData);

    if (files) {
      // automatically uploads the files based on the entry and the model
      await strapi.entityService.uploadFiles(entry, files, {
        model: "deploy",
        source: pluginId,
      });
      return this.findOne({ id: entry.id });
    }

    return entry;
  },
};
