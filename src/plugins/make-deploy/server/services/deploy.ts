/**
 *  service
 */

import * as https from "https";
import axios, { AxiosError } from "axios";
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
import {
  IStrapi,
  OnlyStrings,
  StrapiDBQueryArgs,
  WhereClause,
} from "strapi-typed";
import { Strapi } from "@strapi/strapi";
import { IUser } from "../content-types/user";

const { ApplicationError, ValidationError } = errors;

const MODEL_NAME = "deploy";

export default ({ strapi }: { strapi: IStrapi }) => ({
  /**
   * Promise to fetch all records
   */
  find(params: any) {
    return strapi
      .query<IDeploy>(`plugin::${pluginId}.${MODEL_NAME}`)
      .findMany(params);
  },

  /**
   * Promise to fetch record
   */
  findOne: (params: StrapiDBQueryArgs<keyof IDeploy>) =>
    strapi.query<IDeploy>(`plugin::${pluginId}.${MODEL_NAME}`).findOne(params),

  /**
   * Promise to count record
   */
  count(params?: StrapiDBQueryArgs<keyof IDeploy>) {
    return strapi
      .query<IDeploy>(`plugin::${pluginId}.${MODEL_NAME}`)
      .count(params);
  },

  /**
   * Promise to search records
   */
  search(params?: StrapiDBQueryArgs<keyof IDeploy>) {
    return strapi
      .query<IDeploy>(`plugin::${pluginId}.${MODEL_NAME}`)
      .findMany(params);
  },

  startNewDeploy: async (data: ICreateDeployDTO, user?: IUser) => {
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
        ((currentSetting && currentSetting.roles) ?? []).map((role) => role.id),
        (user?.roles ?? []).map((role) => role.id)
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

    const createDeploy = await strapi
      .query<IDeploy>(`plugin::${pluginId}.${MODEL_NAME}`)
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

    const createStatusMessage_init = await strapi
      .query<IDeployStatus>(`plugin::${pluginId}.deploy-status`)
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
            "x-user": user?.username ?? "",
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
      const err = error as AxiosError;
      if (err.response) {
        // Request made and server responded
        console.warn("error.response", err.response);
        console.warn("error.request.headers:::", err.request);
      } else if (err.request)
        // The request was made but no response was received
        console.warn("error.request", err.request);
      // Something happened in setting up the request that triggered an Error
      else console.warn("error.message", err.message);

      await strapi.query(`plugin::${pluginId}.deploy-status`).create({
        data: {
          message: `Nebylo možné spustit sestavení aplikace: ${err.message}`,
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
        .query<IDeploy>(`plugin::${pluginId}.${MODEL_NAME}`)
        .update({ where: { id: createDeploy.id }, data: updatedBody });
    }

    return createDeploy;
  },

  update: async (
    params: WhereClause<OnlyStrings<keyof IDeploy>>,
    data: Partial<IDeployStatus>,
    { files }: { files?: unknown } = {}
  ) => {
    const existingEntry = await strapi
      .query<IDeploy>(`plugin::${pluginId}.deploy`)
      .findOne({ where: params });

    console.log("existingEntry", existingEntry, params);

    const validData = await (
      strapi as unknown as Strapi
    ).entityValidator.validateEntityUpdate(
      strapi.getModel(`plugin::${pluginId}.deploy`),
      data
    );

    console.log("validData", validData);
    const deployStatus_validData = await (
      strapi as unknown as Strapi
    ).entityValidator.validateEntityCreation(
      strapi.getModel(`plugin::${pluginId}.deploy-status`),
      {
        message: data.message,
        status: data.status,
        stage: data.stage,
        deploy: { id: params.id },
      }
    );
    console.log("deployStatus_validData", deployStatus_validData);

    await strapi
      .query(`plugin::${pluginId}.deploy-status`)
      .create({ data: deployStatus_validData });

    const entry = await strapi
      .query<IDeploy>(`plugin::${pluginId}.deploy`)
      .update({ where: params, data: validData });
    console.log("entry", entry);
    if (files) {
      // automatically uploads the files based on the entry and the model
      await (strapi as unknown as Strapi).entityService.uploadFiles(
        entry,
        files,
        {
          model: "deploy",
          source: pluginId,
        }
      );
      return strapi
        .query<IDeploy>(`plugin::${pluginId}.${MODEL_NAME}`)
        .findOne({ where: { id: entry.id } });
    }

    return entry;
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

      const createStatusMessage = await strapi
        .query<IDeployStatus>(`plugin::${pluginId}.deploy-status`)
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
      .query<IDeploy>(`plugin::${pluginId}.${MODEL_NAME}`)
      .update({ where: { id }, data: updatedBody });
  },
});
