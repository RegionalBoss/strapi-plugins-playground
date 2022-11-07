"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeployStatusEnum = void 0;
const schema_json_1 = __importDefault(require("./schema.json"));
var DeployStatusEnum;
(function (DeployStatusEnum) {
    DeployStatusEnum["info"] = "info";
    DeployStatusEnum["warning"] = "warning";
    DeployStatusEnum["error"] = "error";
})(DeployStatusEnum = exports.DeployStatusEnum || (exports.DeployStatusEnum = {}));
exports.default = {
    schema: schema_json_1.default,
};
