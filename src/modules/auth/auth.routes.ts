/**
 * User Router
 * Defines routes for user-related operations.
 */

import { Router } from "express";
import * as userController from "./auth.controller";
import { validate } from "../../middleware/validateRequest";
import { registerSchema, loginSchema, upsertProfileSchema } from "./auth.validation";
import { authenticateToken } from "../../middleware/auth.middleware";
import {
  requestPasswordResetController,
  resetPasswordController,
} from "./password-reset.controller";

import { 
  requestPasswordResetSchema,  
  resetPasswordSchema           
} from "./password-reset.validation";

const router = Router();

// GET /api/v1/users - Get all users (development only)
if (process.env.NODE_ENV === "development") {
  router.get("/", userController.getAllUsersHandler);
}


// POST /api/v1/users/register - Register a new user
router.post(
  "/register",
  validate(registerSchema),
  userController.registerUserHandler
);

// POST /api/v1/users/login - Login a user
router.post(
  "/login",
  validate(loginSchema),
  userController.loginUserHandler
);

// GET /api/v1/users/public_profile - Returns user public profile
router.get(
  "/public_profile/:id",
  userController.getPublicProfile
);

// GET /api/v1/users/verify?token=... - Email verification, marks user as verified if token is valid
router.get("/verify", userController.verifyEmailHandler);

// POST /api/v1/users/resend-verification
router.post("/resend-verification", userController.resendVerificationHandler);


// GET /api/v1/users/me - Returns the currently authenticated user's data
router.get(
  "/me", 
  authenticateToken, 
  userController.getCurrentUserHandler
);


// PUT /api/v1/users/upsert-profile - Upsert profile
router.put(
  "/upsert-profile",
  authenticateToken,
  validate(upsertProfileSchema),
  userController.upsertProfileHandler
);

// Password reset with validation
router.post(
  "/request-password-reset",
  validate(requestPasswordResetSchema),
  requestPasswordResetController
);

router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  resetPasswordController
);

export default router;
