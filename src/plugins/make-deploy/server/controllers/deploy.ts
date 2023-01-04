/**
 *  controller
 */
import { parseMultipartData, sanitize } from "@strapi/utils";
import { Context } from "koa";
import { ICreateDeployDTO, IDeploy } from "../content-types/deploy";
import pluginId from "../pluginId";
import { validateCreateDeploy } from "../validators/deploy";

const SERVICE = "deploy";

export default {
  /**
   * Retrieve records.
   *
   * @return {Array}
   */

  async find(ctx: Context): Promise<IDeploy[]> {
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

  async findOne(ctx: Context): Promise<IDeploy> {
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

  count(ctx: Context) {
    if (ctx.query._q) {
      return strapi.plugin(pluginId).service(SERVICE).countSearch(ctx.query);
    }
    return strapi.plugin(pluginId).service(SERVICE).count(ctx.query);
  },

  async startNewDeploy(ctx: Context) {
    const userObject = {
      createdBy: ctx.state.user,
      updatedBy: ctx.state.user,
    };

    const createDeployBody: ICreateDeployDTO = {
      ...(ctx.request as any).body,
      ...userObject,
    };
    const { error } = await validateCreateDeploy(createDeployBody);
    if (error) return ctx.badRequest("ValidationError", { errors: error });

    return strapi
      .plugin(pluginId)
      .service(SERVICE)
      .startNewDeploy(createDeployBody, ctx.state.user);
  },

  /**
   * Update a record.
   *
   * @return {Object}
   */
  async update(ctx: Context) {
    const { id } = ctx.params;

    let entity;
    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi
        .plugin(pluginId)
        .service(SERVICE)
        .update({ id }, data, {
          files,
        });
    } else {
      entity = await strapi
        .plugin(pluginId)
        .service(SERVICE)
        .update({ id }, ctx.request.body);
    }

    return sanitize.contentAPI.output(
      entity,
      strapi.getModel(`plugin::${pluginId}.deploy`)
    );
  },
};
