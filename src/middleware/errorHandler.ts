/**
 * Error handling middleware for Express applications.
 * Catches errors and sends appropriate HTTP responses.
 */
import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error(err.stack);

  if (err.message === "User not found") {
    res
      .status(404)
      .json({ message: "A user with that id does not exists." });
    return;
  }

  if (err.message === "Email already in use") {
    res.status(409).json({ message: "Email already in use." });
    return;
  }

  if (err.message === "Invalid email or password") {
    res.status(401).json({ message: "Invalid email or password."});
    return;
  }

  res
    .status(500)
    .json({ message: "Something went wrong on the server." });
  return;
};