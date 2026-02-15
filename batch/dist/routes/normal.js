"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const service_1 = require("../service");
const authentication_1 = require("../authentication");
const router = express_1.default.Router();
router.get("/populate-document/:roomId", (req, res) => (0, service_1.populateTextCode)(req, res));
router.post("/register", (req, res) => (0, service_1.handleRegister)(req, res));
router.post("/login", (req, res) => (0, service_1.handleLogin)(req, res));
router.post("/logout", (req, res) => (0, service_1.handleLogout)(req, res));
router.post("/validate", (req, res) => (0, authentication_1.handleValidateToken)(req, res));
exports.default = router;
