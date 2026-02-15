"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRoomId = void 0;
exports.getMonthName = getMonthName;
exports.pad2 = pad2;
const crypto_1 = __importDefault(require("crypto"));
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const generateRoomId = (length = 6) => {
    let id = "";
    const randomBytes = crypto_1.default.randomBytes(length);
    for (let i = 0; i < length; i++) {
        id += ALPHABET[randomBytes[i] % ALPHABET.length];
    }
    return id;
};
exports.generateRoomId = generateRoomId;
function getMonthName(monthIndex) {
    return MONTHS[monthIndex] ?? "";
}
function pad2(value) {
    return String(value).padStart(2, "0");
}
