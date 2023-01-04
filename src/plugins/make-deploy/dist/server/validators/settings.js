"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSettings = void 0;
const utils_1 = require("@strapi/utils");
const settingsSchema = utils_1.yup
    .object({
    name: utils_1.yup.string().required(),
    deploy: utils_1.yup.string().required(),
    link: utils_1.yup.string().required(),
    roles: utils_1.yup.array().required(),
})
    .required();
const validateSettings = async (data) => {
    try {
        await settingsSchema.validate(data, {
            abortEarly: false,
        });
        return { error: null };
    }
    catch (error) {
        return { error };
    }
};
exports.validateSettings = validateSettings;
