import sgMail, { initSendGrid } from "../config/sendGrid.js";

export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    initSendGrid();

    const msg = {
      to,
      from: process.env.FROM_EMAIL || "fidha@mostech.ae",
      subject,
      html,
      text,
    };

    await sgMail.send(msg);
  } catch (error) {
    console.error("Email sending failed:", error.message);
    throw new Error("Email service failed");
  }
};