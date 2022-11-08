"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const settings_1 = __importDefault(require("./settings"));
const deploy_1 = __importDefault(require("./deploy"));
exports.default = {
    settings: settings_1.default,
    deploy: deploy_1.default,
};
