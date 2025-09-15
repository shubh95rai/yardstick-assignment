import express from "express";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/roleMiddleware.js";
import { upgradePlan } from "../controllers/upgradeController.js";
const upgradeRouter = express.Router();

upgradeRouter.post("/:slug/upgrade", protect, adminOnly, upgradePlan);

export default upgradeRouter;
