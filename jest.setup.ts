import dotenv from 'dotenv';

// Only load .env in local development (CI uses GitHub secrets via workflow env)
if (process.env.CI !== 'true') {
  dotenv.config();
}

// These will use values from either .env (local) or GitHub secrets (CI)
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://test:test@localhost:5432/test';
process.env.DIRECT_URL = process.env.DIRECT_URL || 'postgresql://test:test@localhost:5432/test';
process.env.SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || 'SG.test-key';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
process.env.EMAIL_FROM = process.env.EMAIL_FROM || 'test@campusconnect.com';
process.env.FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
process.env.EMAIL_VERIFICATION_URL = process.env.EMAIL_VERIFICATION_URL || 'http://localhost:3000/verify';
process.env.PASSWORD_RESET_TOKEN_EXPIRY = process.env.PASSWORD_RESET_TOKEN_EXPIRY || '3600000';
process.env.SENDGRID_FROM_NAME = process.env.SENDGRID_FROM_NAME || 'CampusConnect';
process.env.BCRYPT_SALT_ROUNDS = process.env.BCRYPT_SALT_ROUNDS || '10';