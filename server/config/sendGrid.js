import sgMail from "@sendgrid/mail";

let initialized = false;

export const initSendGrid = () => {
  if (!initialized) {
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error("SENDGRID_API_KEY not set");
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    initialized = true;
  }
};

export default sgMail;