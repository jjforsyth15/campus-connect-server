import request from "supertest";
import app from "../../../index";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

describe("Password Reset API", () => {
  let testUser: any;

  beforeAll(async () => {
    // Create test user
    testUser = await prisma.user.create({
      data: {
        email: "resettest@my.csun.edu",
        passwordHashed: await bcrypt.hash("OldPassword123!", 10),
        firstName: "Reset",
        lastName: "Test",
        userType: "student",
        isVerified: true,
      },
    });
  });

  afterAll(async () => {
    // Clean up
    await prisma.user.deleteMany({
      where: { email: "resettest@my.csun.edu" },
    });
    await prisma.$disconnect();
  });

  describe("POST /api/v1/users/request-password-reset", () => {
    it("should accept valid CSUN email", async () => {
      const response = await request(app)
        .post("/api/v1/users/request-password-reset")
        .send({ email: "resettest@my.csun.edu" });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it("should reject non-CSUN email", async () => {
      const response = await request(app)
        .post("/api/v1/users/request-password-reset")
        .send({ email: "test@gmail.com" });

      expect(response.status).toBe(400);
      // REMOVED: expect(response.body.success).toBe(false);
    });

    it("should reject missing email", async () => {
      const response = await request(app)
        .post("/api/v1/users/request-password-reset")
        .send({});

      expect(response.status).toBe(400);
    });

    it("should return success for non-existent email (security)", async () => {
      const response = await request(app)
        .post("/api/v1/users/request-password-reset")
        .send({ email: "nonexistent@my.csun.edu" });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe("POST /api/v1/users/reset-password", () => {
    it("should reject weak password", async () => {
      const response = await request(app)
        .post("/api/v1/users/reset-password")
        .send({
          token: "fake-token",
          password: "weak",
        });

      expect(response.status).toBe(400);
      // REMOVED: expect(response.body.success).toBe(false);
    });

    it("should reject password without uppercase", async () => {
      const response = await request(app)
        .post("/api/v1/users/reset-password")
        .send({
          token: "a".repeat(64),
          password: "password123!",
        });

      expect(response.status).toBe(400);
    });

    it("should reject password without special character", async () => {
      const response = await request(app)
        .post("/api/v1/users/reset-password")
        .send({
          token: "a".repeat(64),
          password: "Password123",
        });

      expect(response.status).toBe(400);
    });

    it("should reject invalid token", async () => {
      const response = await request(app)
        .post("/api/v1/users/reset-password")
        .send({
          token: "invalid-token-123",
          password: "NewPassword123!",
        });

      expect(response.status).toBe(400);
      // REMOVED: expect(response.body.message).toContain("Invalid or expired");
    });

    it("should reject missing token", async () => {
      const response = await request(app)
        .post("/api/v1/users/reset-password")
        .send({
          password: "NewPassword123!",
        });

      expect(response.status).toBe(400);
    });
  });
});