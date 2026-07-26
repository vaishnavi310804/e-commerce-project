import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: Number(process.env.EMAIL_PORT) === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 20000,
  greetingTimeout: 20000,
  socketTimeout: 20000,
});

transporter.verify((err, success) => {
  if (err) {
    console.error("SMTP VERIFY ERROR:", err);
  } else {
    console.log("SMTP READY");
  }
});

export const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER) {
    throw new Error("Email service credentials not configured in environment.");
  }

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject,
    html,
  });

  console.log("NODEMAILER SENDMAIL RESPONSE INFO:", {
    messageId: info?.messageId,
    accepted: info?.accepted,
    rejected: info?.rejected,
    response: info?.response,
  });

  if (!info.accepted || !info.accepted.includes(to)) {
    throw new Error(
      `Email was not accepted by SMTP server. Response: ${info.response}`
    );
  }

  return info;
};

export const sendForgotPasswordOTP = async (email, otp) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin:auto;">
      <h2>Reset Your Password</h2>
      <p>Hello,</p>
      <p>We received a request to reset your ShopEase account password.</p>
      <p>Your One-Time Password (OTP) is:</p>
      <h1 style="
          text-align:center;
          background:#f5f5f5;
          padding:15px;
          letter-spacing:8px;
      ">
        ${otp}
      </h1>
      <p>This OTP is valid for <strong>10 minutes</strong>.</p>
      <p>If you didn't request a password reset, you can safely ignore this email.</p>
      <br>
      <p>Regards,</p>
      <p><strong>ShopEase Team</strong></p>
    </div>
  `;

  return await sendEmail({
    to: email,
    subject: "ShopEase Password Reset OTP",
    html,
  });
};

export const sendEmailChangeOTP = async (email, otp) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin:auto;">
      <h2>Verify Your New Email Address</h2>
      <p>Hello,</p>
      <p>We received a request to change the email address associated with your ShopEase account.</p>
      <p>Please use the following One-Time Password (OTP) to verify your new email:</p>
      <h1 style="
          text-align:center;
          background:#f5f5f5;
          padding:15px;
          letter-spacing:8px;
      ">
        ${otp}
      </h1>
      <p>This OTP is valid for <strong>10 minutes</strong>.</p>
      <p>If you didn't request this email change, please ignore this email. Your account will remain unchanged unless the OTP is verified.</p>
      <br>
      <p>Regards,</p>
      <p><strong>ShopEase Team</strong></p>
    </div>
  `;

  return await sendEmail({
    to: email,
    subject: "Verify Your New Email Address",
    html,
  });
};