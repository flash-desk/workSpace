import express from "express";
const router = express.Router();

import { registerSchema } from "./auth.validation.js";
import validate from "../../middlewares/validate.js";
import authenticate from "../../middlewares/authenticate.js";
import uploadMemory from "../../middlewares/uploadMemory.js";
import { forgotPasswordLimiter, otpAttemptLimiter } from "../../middlewares/rateLimit.js";
import {
  register,
  activateAccount,
  login,
  refreshToken,
  logout,
  logoutAll,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
} from "./auth.controller.js";

router.route("/register").post(
  uploadMemory(2, 1).single("avatar"),
  validate(registerSchema),
  register,
);
router.route("/activate-account").get(activateAccount);
router.route("/login").post(login); // to do add limiters to login route to prevent brute-force attacks
router.route("/refresh").post(refreshToken);
router.route("/logout").post(authenticate, logout);
router.route("/logout-all").post(authenticate, logoutAll);
router.route("/forgot-password").post(forgotPasswordLimiter, forgotPassword);
router.route("/verify-reset-otp").post(otpAttemptLimiter, verifyResetOTP);
router.route("/reset-password").post(otpAttemptLimiter, resetPassword);

export default router;
