"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDeployStatus = void 0;
const utils_1 = require("@strapi/utils");
const validationSchema = utils_1.yup.object({
    message: utils_1.yup.string().required(),
    status: utils_1.yup.string(),
    stage: utils_1.yup.string(),
});
const validateDeployStatus = async (data) => {
    try {
        await validationSchema.validate(data, {
            abortEarly: false,
        });
        return { error: null };
    }
    catch (error) {
        return { error };
    }
};
exports.validateDeployStatus = validateDeployStatus;
