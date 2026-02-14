import express from "express";
import { handleLogin, handleLogout, handleRegister, populateTextCode } from "../service";
import { handleValidateToken } from "../authentication";
const router = express.Router();


router.get("/populate-document/:roomId", (req, res) => populateTextCode(req, res));
router.post("/register", (req, res) => handleRegister(req, res));
router.post("/login", (req, res) => handleLogin(req, res));
router.post("/logout" , (req ,res) => handleLogout(req ,res));
router.post("/validate", (req, res) => handleValidateToken(req, res));





export default router;