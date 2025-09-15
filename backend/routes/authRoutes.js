import express from "express";
import {
  login,
  logout,
  checkAuth,
  inviteUser,
  fetchInviteDetails,
  acceptInvite,
} from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/roleMiddleware.js";

const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/check-auth", protect, checkAuth);

authRouter.post("/invite", protect, adminOnly, inviteUser);
authRouter.get("/invite/:token", fetchInviteDetails);
authRouter.post("/accept-invite", acceptInvite);

export default authRouter;
