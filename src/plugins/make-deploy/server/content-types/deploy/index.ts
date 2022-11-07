import { DeployStatusEnum, IBaseObject, IDeployStatus } from "../deploy-status";
import { IUser } from "../user";
import schema from "./schema.json";

export interface IDeploy extends IBaseObject {
  readonly id: number;
  name: string;
  isFinal: boolean;
  deployStatuses?: IDeployStatus[];
}

export interface ICreateDeployDTO extends IBaseObject {
  name: string;
  isFinal: boolean;
  stage: string;
  status: DeployStatusEnum;
  message: string;
  createdBy?: IUser;
  updatedBy?: IUser;
}

export default {
  schema,
};
