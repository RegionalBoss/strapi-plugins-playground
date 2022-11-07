/**
 *  controller
 */
import { parseMultipartData } from "@strapi/utils";
import intersection from "lodash/intersection";
import pluginId from "../pluginId";
import axios from "axios";
import https from "https";

export default {
  /**
   * Retrieve records.
   *
   * @return {Array}
   */

  async find(ctx) {
    const entities = ctx.query._q
      ? await strapi.plugin("make-deploy").service("deploy").search(ctx.query)
      : await strapi.plugin("make-deploy").service("deploy").find(ctx.query);
    return entities;
  },

  /**
   * Retrieve a record.
   *
   * @return {Object}
   */

  async findOne(ctx) {
    const { id } = ctx.params;

    const entity = await strapi
      .plugin("make-deploy")
      .service("deploy")
      .findOne({
        id,
      });
    return entity;
  },
  /**
   * Count records.
   *
   * @return {Number}
   */

  count(ctx) {
    if (ctx.query._q) {
      return strapi
        .plugin("make-deploy")
        .service("deploy")
        .countSearch(ctx.query);
    }
    return strapi.plugin("make-deploy").service("deploy").count(ctx.query);
  },

  /**
   * Update a record.
   *
   * @return {Object}
   */

  async update(ctx) {
    const { id } = ctx.params;

    let entity;
    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi
        .plugin("make-deploy")
        .service("deploy")
        .update({ id }, data, {
          files,
        });
    } else {
      entity = await strapi
        .plugin("make-deploy")
        .service("deploy")
        .update({ id }, ctx.request.body);
    }

    return entity;
  },

  async createDeploy(ctx) {
    const userObject = {
      created_by: ctx.state.user,
      updated_by: ctx.state.user,
    };
    const roleID = ctx.state.user.roles;

    // create generate ID
    const createDeployBody = { ...ctx.request.body, ...userObject };
    // Get settings for current environment
    const settings = await strapi
      .plugin("make-deploy")
      .service("settings")
      .getSettings();

    const currentSettings = settings.find(
      (s) => s.name === ctx.request.body.name
    );

    // Prevent from removing the public role.
    if (
      intersection(
        ((currentSettings && currentSettings.roles) || []).map(
          (role) => role.id
        ),
        (roleID || []).map((role) => role.id)
      ).length === 0
    ) {
      // return ctx.badRequest(null, [{ messages: [{ id: "Unauthorized" }] }]);
      return ctx.throw(406, "Account is not authorized to run this build");
    }

    // validate if there are no unfinished jobs in current environment
    const { results: notFinalItems } = await strapi
      .query(`plugin::${pluginId}.deploy`)
      .findPage({
        _sort: "created_at:desc",
        isFinal: false,
        name: ctx.request.body.name,
      });

    if (notFinalItems.length > 0) {
      ctx.throw(406, "Some previous build has isFinal: false");
    }

    const createDeploy = await strapi
      .query(`plugin::${pluginId}.deploy`)
      .create(createDeployBody);

    // save statusMessage
    const createStatusMessageBody_init = {
      deploy: { id: createDeploy.id },
      message: ctx.request.body.message,
      stage: ctx.request.body.stage,
      status: ctx.request.body.status,
      ...userObject,
    };
    const createStatusMessage_init = await strapi
      .query(`plugin::${pluginId}.deployStatus`)
      .create(createStatusMessageBody_init);

    // request to buildmachine
    try {
      const externalServiceResponse = await axios(currentSettings.deploy, {
        params: {
          release: createDeploy.id,
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
        headers: {
          "x-user": ctx.state.user.username,
          authorization: process.env.DEPLOY_AUTHORIZATION || "",
        },
      });

      await strapi.query(`plugin::${pluginId}.deployStatus`).create({
        message: "Spuštěno sestavení aplikace",
        stage: "BE Strapi",
        status: "info",
        deploy: { id: createDeploy.id },
        ...userObject,
      });
    } catch (error) {
      if (error.response) {
        // Request made and server responded
        console.log("error.response");
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);

        console.log("error.request.headers:::");
        console.log(error.request);
      } else if (error.request) {
        // The request was made but no response was received
        console.log("error.request");
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("error.message");
        console.log("Error", error.message);
      }

      await strapi.query(`plugin::${pluginId}.deployStatus`).create({
        message: `Nebylo možné spustit sestavení aplikace: ${error.message}`,
        stage: "BE Strapi",
        status: "error",
        deploy: { id: createDeploy.id },
        ...userObject,
      });
      const updatedBody = {
        isFinal: true,
      };
      return await strapi
        .query(`plugin::${pluginId}.deploy`)
        .update({ id: createDeploy.id }, updatedBody);
    }

    return createDeploy;
  },
};
