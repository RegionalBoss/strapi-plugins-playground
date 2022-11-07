/**
 *  controller
 */
import { parseMultipartData } from "@strapi/utils";
import intersection from "lodash/intersection";
import pluginId from "../pluginId";
import axios from "axios";
import https from "https";
import { validateCreateDeploy } from "../validators/deploy";
import { ICreateDeployDTO, IDeploy } from "../content-types/deploy";

const SERVICE = "deploy";

export default {
  /**
   * Retrieve records.
   *
   * @return {Array}
   */

  async find(ctx): Promise<IDeploy[]> {
    const entities = ctx.query._q
      ? await strapi.plugin(pluginId).service(SERVICE).search(ctx.query)
      : await strapi.plugin(pluginId).service(SERVICE).find(ctx.query);
    return entities;
  },

  /**
   * Retrieve a record.
   *
   * @return {Object}
   */

  async findOne(ctx): Promise<IDeploy> {
    const { id } = ctx.params;

    const entity = await strapi.plugin(pluginId).service(SERVICE).findOne({
      id,
    });
    return entity as IDeploy;
  },
  /**
   * Count records.
   *
   * @return {Number}
   */

  count(ctx) {
    if (ctx.query._q) {
      return strapi.plugin(pluginId).service(SERVICE).countSearch(ctx.query);
    }
    return strapi.plugin(pluginId).service(SERVICE).count(ctx.query);
  },

  async startNewDeploy(ctx) {
    const userObject = {
      createdBy: ctx.state.user,
      updatedBy: ctx.state.user,
    };
    // TODO: získaní roli uživatele, a práce s permissions
    // const roleID = ctx.state.user.roles;
    const createDeployBody: ICreateDeployDTO = {
      ...ctx.request.body,
      ...userObject,
    };
    const { error } = await validateCreateDeploy(createDeployBody);
    if (error) return ctx.badRequest("ValidationError", { errors: error });

    return strapi
      .plugin(pluginId)
      .service(SERVICE)
      .startNewDeploy(createDeployBody, ctx.state.user);
  },
};
