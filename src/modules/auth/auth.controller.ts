/**
 * User Controller
 * Handles user-related HTTP requests and responses.
*/
import { Request, Response, NextFunction } from "express";
import * as userService from "./auth.service";

// Get all users
export const getAllUsersHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
    console.log("Fetched all users");
  } catch (error) {
    next(error);
    console.error("Error fetching users:", error);
  }
};

export const registerUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newUser = await userService.registerUser(req.body);
    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    });
    console.log("User registered:", newUser.email);
  } catch (error) {
    next(error);
  }
};

export const loginUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await userService.loginUser(email, password);
    res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
    console.log("User logged in:", email);
  } catch (error: any) {
    // Send proper JSON error responses
    console.error("Login error:", error.message);

    // Email not verified
    if (error.message === "Please verify your email before logging in") {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in"
      });
    }

    // Invalid credentials
    if (error.message === "Invalid email or password") {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Generic error
    return res.status(500).json({
      success: false,
      message: error.message || "Login failed"
    });
  } 
};

// Upsert user profile
export const upsertProfileHandler = async (
  req: Request,
  res: Response, 
  next: NextFunction
) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) 
      return res.status(401).json({ message: "Unauthorized: User ID missing" });

    const updatedProfile = await userService.upsertUserProfile(userId, req.body);

    console.log("Upsert profile request body:", req.body);

    return res.status(200).json({
      message: "Profile upserted successfully",
      data: updatedProfile,
    });
  } catch (error) {
    console.error("Error: upsertProfileHandler:", error);
    return res.status(500).json({ message: "backend/src/api/user/user.controller.ts/upsertProfileHandler: Something went wrong" });
  }
}; 
// get current authenticated user
export const getCurrentUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // req.user is set by authenticateToken middleware
    if (!req.user) {
      return res.status(401).json({ 
        error: "Authentication required" 
      });
    }

    res.status(200).json({
      user: req.user,
    });
    console.log("Fetched current user:", req.user.email);
  } catch (error) {
    next(error);
  }
};

// get public user profile via user id
export const getPublicProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id.trim();

    if(!id) 
      return res.status(400).json({ error: "User id missing" });

    const profile = await userService.publicProfile(id);
    
    res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
};

// Verifies user's email using token sent via SendGrid
export const verifyEmailHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.query;

    if (!token || typeof token !== "string") {
      return res.status(400).json({ message: "Invalid token" });
    }

    const user = await userService.verifyUserEmail(token);

    res.status(200).json({ message: "Email verified successfully!" });
    console.log("User verified:", user.email);
  } catch (error) {
    next(error);
  }
};

// Resends a new email verification link to the user
export const resendVerificationHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    await userService.resendVerification(email);

    res.status(200).json ({ message: "Verification email resent"})
    console.log("Resent verification email to: ", email); 
  } catch (error) {
    next(error);
  }
};
