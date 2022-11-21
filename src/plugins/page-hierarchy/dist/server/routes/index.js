"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const items_1 = __importDefault(require("./items"));
const page_1 = __importDefault(require("./page"));
exports.default = {
    items: items_1.default,
    page: page_1.default,
};
