import { yup, formatYupErrors } from "@strapi/utils";
import { ICreateDeployDTO, IDeploy } from "../content-types/deploy";
import { IDeployStatus } from "../content-types/deploy-status";
import { IValidationResult } from "./deploy";

const validationSchema = yup.object({
  message: yup.string().required(),
  status: yup.string(),
  stage: yup.string(),
});

export const validateDeployStatus = async (
  data: IDeployStatus
): Promise<IValidationResult> => {
  try {
    await validationSchema.validate(data, {
      abortEarly: false,
    });
    return { error: null };
  } catch (error: unknown) {
    return { error };
  }
};
