import express from "express";
import { handleGetCreatedRooms } from "../service";

const router = express.Router();



router.get("/all-rooms/:userId", (req, res) => handleGetCreatedRooms(req, res));



export default router;