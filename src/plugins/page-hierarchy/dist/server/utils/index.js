"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertKeysFromSnakeCaseToCamelCase = void 0;
const lodash_1 = require("lodash");
const convertKeysFromSnakeCaseToCamelCase = (obj) => Object.fromEntries(Object.entries(obj).map(([key, value]) => [(0, lodash_1.camelCase)(key), value]));
exports.convertKeysFromSnakeCaseToCamelCase = convertKeysFromSnakeCaseToCamelCase;
