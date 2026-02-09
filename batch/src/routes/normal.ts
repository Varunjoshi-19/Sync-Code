import express from "express";
import { handleLogin, handleRegister, populateTextCode } from "../service";

const router = express.Router();


router.get("/populate-document/:roomId", (req, res) => populateTextCode(req, res));
router.post("/register", (req, res) => handleRegister(req, res));
router.post("/login", (req, res) => handleLogin(req, res));





export default router;