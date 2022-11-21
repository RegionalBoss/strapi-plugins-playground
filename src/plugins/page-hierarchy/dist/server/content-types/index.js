"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const page_1 = __importDefault(require("./page"));
const Item_1 = __importDefault(require("./Item"));
const auditLog_1 = __importDefault(require("./auditLog"));
exports.default = {
    "audit-log": auditLog_1.default,
    item: Item_1.default,
    page: page_1.default,
};
