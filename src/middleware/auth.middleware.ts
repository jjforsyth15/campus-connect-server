// Authentication: Verifies JWT tokens and sends user to request

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../utils/prisma";

interface JWTPayload {
  id: string;
  email: string;
  userType: string;
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({ 
        error: "Authentication required",
        message: "No token provided" 
      });
      return;
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "default_secret"
    ) as JWTPayload;

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      omit: {
        passwordHashed: true,
      },
    });

    if (!user) {
      res.status(401).json({ 
        error: "Authentication failed",
        message: "User not found" 
      });
      return;
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ 
        error: "Authentication failed",
        message: "Invalid token" 
      });
      return;
    } else if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ 
        error: "Authentication failed",
        message: "Token expired" 
      });
      return;
    } else {
      res.status(500).json({ 
        error: "Internal server error",
        message: "Authentication check failed" 
      });
      return;
    }
  }
};