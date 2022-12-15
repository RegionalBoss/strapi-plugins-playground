"use strict";
/**
 * test-single-type service
 */
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
exports.default = strapi_1.factories.createCoreService('api::test-single-type.test-single-type');
