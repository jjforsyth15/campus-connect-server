/**
 * Utility to create and export a single PrismaClient instance
 * to be used throughout the application.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;