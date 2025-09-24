import express from "express";
import fighterController from "../controllers/fighterFunctions.js";

const router = express.Router();

router.get("/", fighterController.getAllfighters);
router.get("/name/:name", fighterController.getFighterByName);

export default router;