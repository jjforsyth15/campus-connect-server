import { Request, Response } from "express";
import {
  requestPasswordReset,
  resetPassword,
} from "./password-reset.service";

// Request password reset validation handled by middleware

export const requestPasswordResetController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email } = req.body;
    const result = await requestPasswordReset(email);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Request password reset controller error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process password reset request",
    });
  }
};


// Reset password with token 
export const resetPasswordController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { token, password } = req.body;
    const result = await resetPassword(token, password);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Reset password controller error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to reset password",
    });
  }
};