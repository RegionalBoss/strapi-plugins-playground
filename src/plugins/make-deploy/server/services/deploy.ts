/**
 *  service
 */

import * as https from "https";
import axios from "axios";
import pluginId from "../pluginId";
import { errors } from "@strapi/utils";
import { ICreateDeployDTO, IDeploy } from "../content-types/deploy";
import { IDeploySetting } from "../content-types/setting";
import {
  DeployStatusEnum,
  IDeployStatus,
} from "../content-types/deploy-status";
import { validateDeployStatus } from "../validators/deploy-status";
import random from "lodash/random";
import intersection from "lodash/intersection";

const { ApplicationError, ValidationError } = errors;

const MODEL_NAME = "deploy";

export default {
  /**
   * Promise to fetch all records
   *
   * @return {Promise}
   */
  find(params, populate): Promise<IDeploy[]> {
    return strapi.query(`plugin::${pluginId}.${MODEL_NAME}`).findMany(params);
  },

  /**
   * Promise to fetch record
   *
   * @return {Promise}
   */
  findOne(params, populate): Promise<any> {
    return strapi
      .query(`plugin::${pluginId}.${MODEL_NAME}`)
      .findOne(params, populate);
  },

  /**
   * Promise to count record
   *
   * @return {Promise}
   */
  count(params) {
    return strapi.query(`plugin::${pluginId}.${MODEL_NAME}`).count(params);
  },

  /**
   * Promise to search records
   *
   * @return {Promise}
   */
  search(params) {
    return strapi.query(`plugin::${pluginId}.${MODEL_NAME}`).search(params);
  },

  startNewDeploy: async (
    data: ICreateDeployDTO,
    user?: { username: string; roles: [{ id: number }] }
  ) => {
    console.log(
      `STRAPI: plugin::${pluginId}.${MODEL_NAME} -`,
      strapi.query(`plugin::${pluginId}.${MODEL_NAME}`)
    );
    const settings: IDeploySetting[] = await strapi
      .plugin(pluginId)
      .service("settings")
      .find();
    const currentSetting = settings.find((s) => s.name === data.name);
    if (!currentSetting)
      throw new ApplicationError("Odpovídající nastaveni nebylo nalezeno");
    if (
      intersection(
        ((currentSetting && currentSetting.roles) || []).map((role) => role.id),
        (user.roles || []).map((role) => role.id)
      ).length === 0
    ) {
      throw new ApplicationError("Account is not authorized to run this build");
    }
    const notFinalItems = await strapi
      .plugin(pluginId)
      .service(MODEL_NAME)
      .find({
        orderBy: { createdAt: "DESC" },
        where: { isFinal: false, name: data.name },
      });
    if (notFinalItems?.length > 0)
      throw new ApplicationError("Some previous build has isFinal: false");

    console.log("CREATE DEPLOY: ", data);

    const createDeploy: IDeploy = await strapi
      .query(`plugin::${pluginId}.${MODEL_NAME}`)
      .create({
        data: {
          name: data.name,
          isFinal: data.isFinal,
        },
      });

    console.log("CREATED DEPLOY: ", createDeploy);

    const userData = {
      createdBy:
        typeof data.createdBy === "number"
          ? data.createdBy
          : data.createdBy?.id,
      updatedBy:
        typeof data.updatedBy === "number"
          ? data.updatedBy
          : data.updatedBy?.id,
    };

    const createStatusMessageBody_init: IDeployStatus = {
      deploy: { id: createDeploy.id },
      message: data.message,
      stage: data.stage,
      status: data.status,
      ...userData,
    };
    const { error } = await validateDeployStatus(createStatusMessageBody_init);
    if (error) throw new ValidationError(error);

    const createStatusMessage_init: IDeployStatus = await strapi
      .query(`plugin::${pluginId}.deploy-status`)
      .create({ data: createStatusMessageBody_init });
    console.log(
      "CREATE DEPLOY STATUS MESSAGE INIT RESPONSE: ",
      createStatusMessage_init
    );

    try {
      const { data: externalServiceResponse } = await axios(
        currentSetting.deploy,
        {
          params: {
            release: createDeploy.id,
          },
          httpsAgent: new https.Agent({
            rejectUnauthorized: false,
          }),
          headers: {
            "x-user": user?.username,
            authorization: process.env.DEPLOY_AUTHORIZATION || "",
          },
        }
      );
      console.log("EXTERNAL SERVICE RESPONSE: ", externalServiceResponse);
      await strapi.query(`plugin::${pluginId}.deploy-status`).create({
        data: {
          message: "Spuštěno sestavení aplikace",
          stage: "BE Strapi",
          status: "info",
          deploy: { id: createDeploy.id },
          ...userData,
        },
      });
      // TODO: just for testing, imitate BE responses that manipulates with strapi DB
      // strapi
      //   .plugin(pluginId)
      //   .service("deploy")
      //   .generateRandomDeployStatuses(createDeploy.id, random(2, 7), userData);
      // TODO: delete when TEST BE is provided
    } catch (error) {
      if (error.response) {
        // Request made and server responded
        console.warn("error.response", error.response);
        console.warn("error.request.headers:::", error.request);
      } else if (error.request)
        // The request was made but no response was received
        console.warn("error.request", error.request);
      // Something happened in setting up the request that triggered an Error
      else console.warn("error.message", error.message);

      await strapi.query(`plugin::${pluginId}.deploy-status`).create({
        data: {
          message: `Nebylo možné spustit sestavení aplikace: ${error.message}`,
          stage: "BE Strapi",
          status: "error",
          deploy: { id: createDeploy.id },
          ...userData,
        },
      });
      const updatedBody = {
        isFinal: true,
      };
      return await strapi
        .query(`plugin::${pluginId}.${MODEL_NAME}`)
        .update({ where: { id: createDeploy.id }, data: updatedBody });
    }

    return createDeploy;
  },

  // TODO: delete function when TEST BE is provided
  generateRandomDeployStatuses: async (
    id: number,
    count: number,
    userData: { createdBy: number; updatedBy: number }
  ) => {
    const statuses = [
      DeployStatusEnum.info,
      DeployStatusEnum.error,
      DeployStatusEnum.warning,
    ];
    const stages = ["DOCKER", "GitLab", "NUXT", "NEXT"];
    for (let i = 0; i < count; i++) {
      await new Promise((resolve) => setTimeout(resolve, random(1, 5) * 1000));

      const randomStatus = statuses[random(0, statuses.length - 1)];
      const randomStage = stages[random(0, stages.length - 1)];
      const createStatusMessageBody: IDeployStatus = {
        deploy: { id },
        message: `Random message ${random(1, 1000)}`,
        stage: randomStage,
        status: randomStatus as DeployStatusEnum,
        ...userData,
      };
      const { error } = await validateDeployStatus(createStatusMessageBody);
      if (error) return new ValidationError(error);

      const createStatusMessage: IDeployStatus = await strapi
        .query(`plugin::${pluginId}.deploy-status`)
        .create({ data: createStatusMessageBody });
      console.log(
        "CREATE DEPLOY STATUS MESSAGE RESPONSE: ",
        createStatusMessage
      );
    }
    // update deploy by id, with isFinish: true
    const updatedBody = {
      isFinal: true,
    };
    return await strapi
      .query(`plugin::${pluginId}.${MODEL_NAME}`)
      .update({ where: { id }, data: updatedBody });
  },
};
