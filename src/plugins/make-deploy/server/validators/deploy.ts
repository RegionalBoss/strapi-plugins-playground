import { yup } from "@strapi/utils";
import { ICreateDeployDTO } from "../content-types/deploy";

export interface IValidationResult {
  error: unknown | null;
}

const validationSchema = yup.object({
  name: yup.string().required(),
  isFinal: yup.bool(),
  message: yup.string().required(),
});

export const validateCreateDeploy = async (
  data: ICreateDeployDTO
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
