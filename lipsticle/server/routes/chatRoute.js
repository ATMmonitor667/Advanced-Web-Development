import express from "express";
import fetchAIResponse from "../controller/AI.js";

const router = express.Router();

router.post("/chat", fetchAIResponse);

export default router;