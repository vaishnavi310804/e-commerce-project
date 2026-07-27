import Brevo from "@getbrevo/brevo";

const apiInstance = new Brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY,
);

export const sendEmail = async ({ to, subject, html }) => {
  const email = new Brevo.SendSmtpEmail();

  email.sender = {
    name: process.env.BREVO_SENDER_NAME,
    email: process.env.BREVO_SENDER_EMAIL,
  };

  email.to = [
    {
      email: to,
    },
  ];

  email.subject = subject;
  email.htmlContent = html;

  try {
    const response = await apiInstance.sendTransacEmail(email);

    console.log("BREVO RESPONSE:", response);

    return response;
  } catch (error) {
    console.error("BREVO ERROR:", error.response?.body || error.message);

    throw error;
  }
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

      <p>If you didn't request this, you can ignore this email.</p>

      <br/>

      <strong>ShopEase Team</strong>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: "ShopEase Password Reset OTP",
    html,
  });
};

export const sendEmailChangeOTP = async (email, otp) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin:auto;">
      <h2>Verify Your New Email</h2>

      <p>Hello,</p>

      <p>Please use the OTP below to verify your new email address.</p>

      <h1 style="
        text-align:center;
        background:#f5f5f5;
        padding:15px;
        letter-spacing:8px;
      ">
        ${otp}
      </h1>

      <p>This OTP is valid for <strong>10 minutes</strong>.</p>

      <br/>

      <strong>ShopEase Team</strong>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: "Verify Your New Email Address",
    html,
  });
};
