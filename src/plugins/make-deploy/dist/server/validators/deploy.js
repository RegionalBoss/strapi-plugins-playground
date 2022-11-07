"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateDeploy = void 0;
const utils_1 = require("@strapi/utils");
const validationSchema = utils_1.yup.object({
    name: utils_1.yup.string().required(),
    isFinal: utils_1.yup.bool(),
    message: utils_1.yup.string().required(),
});
const validateCreateDeploy = async (data) => {
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
exports.validateCreateDeploy = validateCreateDeploy;
