/**
 * User Service
 * Contains business logic for user-related operations.
 * Contains methods interacting with the database.
 */
import prisma from "../../utils/prisma";
import { PublicUser } from "./auth.types";
import bcrypt from "bcrypt";
import { UserType } from "@prisma/client";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";
import { sendVerificationEmail } from "../../utils/sendgrid.service";

// Helper: converts full user object to PublicUser 
export const toPublicUser = (user: any): PublicUser => ({
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    isVerified: user.isVerified,
    profilePicture: user.profilePicture,
    bio: user.bio,
    userType: user.userType,
    city: user.city,
    websites: user.websites,
    createdAt: user.createdAt,
  });

  // Helper: Generates verification token for email verification
export const generateVerificationToken = () => {
    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600 * 1000);
    return {token, expires};
  }

// Get all users
export const getAllUsers = async (): Promise<PublicUser[]> => {
  const users = await prisma.user.findMany({
    omit: {
      passwordHashed: true,
    },
  });

  return users;
};

// Register a new user and initiate email verification
  export const registerUser = async (userData: any): Promise<PublicUser> => {
  const { email, password, firstName, lastName } = userData;

  // Check for email if it already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existingUser) {
    throw new Error("Email already in use");
  }

  // Vaid CSUN EMAIL
  if (!email.toLowerCase().endsWith("@my.csun.edu")){
    throw new Error("Only @my.csun.edu email addresses are allowed");
  }

  // Hash password
  const saltRounds = process.env.BCRYPT_SALT_ROUNDS
    ? parseInt(process.env.BCRYPT_SALT_ROUNDS)
    : 11;
  const passwordHashed = await bcrypt.hash(password, saltRounds);

  // Generate email verification token with 1 hour expiration
  const {token, expires} = generateVerificationToken();

  let newUser;

  try {

      // Create a new user record with verification metadata
      newUser = await prisma.user.create({
       data: {
        email: email.toLowerCase(),
        passwordHashed,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        userType: UserType.student, 
        verificationToken: token,
        verificationTokenExpiration: expires,
        isVerified: false, 
    },
  });

  // Send verification email to user's email
  await sendVerificationEmail(newUser.email, token);

  return toPublicUser(newUser);

} catch (error) {

  // Roll back the user record if any part of registration fails
 if (newUser) {
  await prisma.user.delete ({
    where: {id: newUser.id},
  });
 }
  throw new Error("Failed to register user. Please try again.")
  }
};
  
// Verify a user's email using the verification token and activate their account
export const verifyUserEmail = async (token: string) => {
  const user = await prisma.user.findFirst({
    where: {
      verificationToken: token,
      verificationTokenExpiration: { gte: new Date() },
    },
  });

  if (!user) {
    throw new Error("Invalid or expired token");
  }

  // Mark account as verified and clear token fields
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
      verificationToken: null,
      verificationTokenExpiration: null,
    },
  });

  return toPublicUser(updatedUser);
};

// Resends a new verification email to the user
export const resendVerification = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.isVerified) {
    throw new Error("User already verified");
  }

  const { token, expires } = generateVerificationToken();

  // Updates DB with new token
  await prisma.user.update({
    where: { id: user.id },
    data: {
      verificationToken: token,
      verificationTokenExpiration: expires,
    },
  });

  await sendVerificationEmail(user.email, token);
};

// Login a user
export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  } 

  // Block login until email is verified
  if (!user.isVerified) {
  throw new Error("Please verify your email before logging in");
}

  // Check is password is correct
  const passwordValid = await bcrypt.compare(password, user.passwordHashed);
  if (!passwordValid) {
    throw new Error("Invalid email or password");
  }

  // Generate a JWT token
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      userType: user.userType,
    },
    process.env.JWT_SECRET || "default_secret",
    { expiresIn: "7d" }
  );

  // Return token and user info
  return { token, user: toPublicUser(user) };
};

// Upsert user profile
export const upsertUserProfile = async (userId: string, userData: any): Promise<PublicUser> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User Id not found");
  }

  const profileData = {
    firstName: userData.first,
    lastName: userData.last,
    email: userData.email,
    profilePicture: userData.profilePicture,
    bio: userData.bio,
    city: userData.city,
    websites: userData.websites,
  }

  const updatedProfile = await prisma.user.update({
    where: { id : userId },
    data: { ...profileData  },
  });


  return toPublicUser(updatedProfile);
}

// Get user public profile
export const publicProfile = async (id: string) => {
  const user = await prisma.user.findUnique({ 
    where: { id }
  });

  if (!user) 
    throw new Error("Invalid user id:" + id);

  return toPublicUser(user);
}
