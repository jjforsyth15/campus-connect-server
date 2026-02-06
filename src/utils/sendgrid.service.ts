import nodemailer from "nodemailer";
import type { SendMailOptions } from "nodemailer";


// Load required env variables
const EMAIL_VERIFICATION_URL = process.env.EMAIL_VERIFICATION_URL;


const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_KEY = process.env.SMTP_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL;

//mailer file using brevo SMTP
export const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT) || 587,
  auth: {
    user: SMTP_USER,
    pass: SMTP_KEY,
  },
});

// Sends an email verification link to the user's email
export const sendVerificationEmail = async (to: string, token: string) => {
  const verificationUrl = `${EMAIL_VERIFICATION_URL}?token=${token}`;

  const msg: SendMailOptions = {
    to,
    from: `CampusConnect <${FROM_EMAIL}>`,
    replyTo: FROM_EMAIL,
    subject: "Welcome to CampusConnect — confirm your email",
    text: `Verify your account here: ${verificationUrl}`,
    html: `
      <h2>Welcome to CampusConnect</h2>
      <p>Please confirm your email address:</p>
      <p><a href="${verificationUrl}">Verify Email</a></p>
      <p>If you didn't sign up, you can ignore this.</p>
  `,
  };

  try {
    const info = await transporter.sendMail(msg);
    console.log("messageId:", info.messageId);
    console.log("accepted:", info.accepted);
    console.log("rejected:", info.rejected);
    console.log("response:", info.response);
  } 
  
  catch (error) {
    console.error(`Live email failed to send to ${to}`); 
    throw error;
  }

  console.log("SMTP_HOST:", SMTP_HOST);
  console.log("SMTP_PORT:", SMTP_PORT);
  console.log("SMTP_USER:", SMTP_USER);
  console.log("EMAIL_FROM:", FROM_EMAIL);

  await transporter.verify();
  console.log("SMTP verified");
};