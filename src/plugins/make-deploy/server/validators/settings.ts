"use strict";

import { yup, formatYupErrors } from "@strapi/utils";

const settingsSchema = yup
  .object({
    name: yup.string().required(),
    deploy: yup.string().required(),
    link: yup.string().required(),
    roles: yup.array().required(),
  })
  .required();

export const validateSettings = async (data) => {
  try {
    await settingsSchema.validate(data, {
      abortEarly: false,
    });
    return { error: null };
  } catch (error: unknown) {
    return { error };
  }
};
