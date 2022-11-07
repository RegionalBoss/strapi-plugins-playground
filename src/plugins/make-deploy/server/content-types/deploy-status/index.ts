import { IUser } from "../user";
import schema from "./schema.json";

export interface IBaseObject {
  readonly createdAt?: string;
  readonly updatedAt?: string;
  createdBy?: number | IUser;
  updatedBy?: number | IUser;
}

export enum DeployStatusEnum {
  info = "info",
  warning = "warning",
  error = "error",
}

export interface IDeployStatus extends IBaseObject {
  readonly id?: number;
  message: string;
  status: DeployStatusEnum;
  stage: string;
  deploy: { id: number };
}

export default {
  schema,
};
