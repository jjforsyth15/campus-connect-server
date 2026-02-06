import nodemailer from "nodemailer";


// Load required env variables
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_KEY = process.env.SMTP_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL;
const FRONTEND_URL = process.env.FRONTEND_URL;

//mailer file using brevo SMTP
export const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT) || 587,
  auth: {
    user: SMTP_USER,
    pass: SMTP_KEY,
  },
});

// Send password reset email with secure token link
export const sendPasswordResetEmail = async (to: string, resetToken: string, firstName: string) => {

  const resetUrl = `${FRONTEND_URL}/access/reset-password?token=${resetToken}`;

  const msg: nodemailer.SendMailOptions = {
    to,
    from: `CampusConnect <${FROM_EMAIL}>`,
    replyTo: FROM_EMAIL,
    subject: "Password Reset Request - CampusConnect",

    // Plain text version
    text: `Hi ${firstName},

You requested to reset your password for your CampusConnect account.

Click the link below to reset your password:
${resetUrl}

This link will expire in 1 hour.

If you didn't request this password reset, please ignore this email. Your password will remain unchanged.

Best,
CampusConnect Team
California State University, Northridge`,

    // Basic HTML version
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Password Reset Request</h2>
        
        <p>Hi <strong>${firstName}</strong>,</p>
        
        <p>You requested to reset your password for your CampusConnect account.</p>
        
        <p>Click the link below to reset your password:</p>
        
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        
        <p><strong>This link will expire in 1 hour.</strong></p>
        
        <p>If you didn't request this password reset, you can safely ignore this email.</p>
        
        <hr>
        
        <p style="font-size: 12px; color: #666;">
          CampusConnect<br>
          California State University, Northridge<br>
          This is an automated message, please do not reply.
        </p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(msg);
    console.log("messageId:", info.messageId);
    console.log("accepted:", info.accepted);
    console.log("rejected:", info.rejected);
    console.log("response:", info.response);

    console.log(`✅ Password reset email sent to ${to}`);
  } catch (error: any) {
    console.error("❌ Error sending password reset email:", error);
    if (error.response) {
      console.error("Email Error Response:", error.response.body);
    }
    throw new Error("Failed to send password reset email");
  }

  console.log("SMTP_HOST:", SMTP_HOST);
  console.log("SMTP_PORT:", SMTP_PORT);
  console.log("SMTP_USER:", SMTP_USER);
  console.log("EMAIL_FROM:", FROM_EMAIL);

  await transporter.verify();
  console.log("SMTP verified");
};