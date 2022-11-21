"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagePublicationState = void 0;
const schema_json_1 = __importDefault(require("./schema.json"));
const lifecycles_1 = __importDefault(require("./lifecycles"));
var PagePublicationState;
(function (PagePublicationState) {
    PagePublicationState["DRAFT"] = "draft";
    PagePublicationState["PUBLISHED"] = "published";
})(PagePublicationState = exports.PagePublicationState || (exports.PagePublicationState = {}));
exports.default = {
    lifecycles: lifecycles_1.default,
    schema: schema_json_1.default,
};
