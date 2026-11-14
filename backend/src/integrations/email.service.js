// integrations/email.service.js
import nodemailer from "nodemailer";
import logger from "../utils/logger.js";

export const sendActivationEmail = async (email, activationToken) => {
  logger.debug("Preparing activation email", { email });
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  const activationUrl = `${process.env.CLIENT_URL}/activate-account?token=${activationToken}`;
  console.log(activationToken);
  let info = await transporter.sendMail({
    from: `"FlashDesk" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Activate Your Account",
    html: `
      <h2>Welcome!</h2>
      <p>Please click the button below to activate your account:</p>
      <a href="${activationUrl}">Activate Account</a>
      <p>This link expires in 24 hours.</p>
    `,
  });
  return info;
};

export const sendStaffInviteEmail = async (email, resetToken, roleName) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });


  const setPasswordUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
  await transporter.sendMail({
    from: `"FlashDesk" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your staff account has been created",
    html: `
      <h2>Welcome to the team!</h2>
      <p>An account has been created for you with the role <b>${roleName}</b>.</p>
      <p>Please set your password to activate it:</p>
      <a href="${setPasswordUrl}">Set Your Password</a>
      <p>This link expires in 10 minutes.</p>
    `,
  });
};

export const sendResetPasswordOTP = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"FlashDesk" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Password Reset Code",
    html: `
      <h2>Password Reset</h2>
      <p>Your password reset code is:</p>
      <h1>${otp}</h1>
      <p>This code will expire in 10 minutes.</p>
    `,
  });
};
