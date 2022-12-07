"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const newsletter_1 = __importDefault(require("./newsletter"));
const newsletter_signature_1 = __importDefault(require("./newsletter-signature"));
exports.default = {
    newsletter: newsletter_1.default,
    "newsletter-signature": newsletter_signature_1.default,
};
