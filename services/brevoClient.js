// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   service: "brevo",
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// });

// export const sendVerificationEmail = async (email, verificationLink) => {
//   const mailOptions = {
//     from: "veronika.karaulov@gmail.com",
//     to: email,
//     subject: "Please verify your email",
//     text: `Click this link to verify your email: ${verificationLink}`,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log("Verification email sent successfully.");
//   } catch (error) {
//     console.error("Error sending verification email:", error);
//     throw new Error("Error sending verification email");
//   }
// };
import SibApiV3Sdk from "sib-api-v3-sdk";

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;
const sendVerificationEmail = async (email, verificationLink) => {
  const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

  const sendSmtpEmail = {
    to: [{ email }],
    sender: { email: "veronika.karaulov@gmail.com" },
    subject: "Please verify your email",
    htmlContent: `<p>Click this link to verify your email: <a href="${verificationLink}">${verificationLink}</a></p>`,
  };

  try {
    await emailApi.sendTransacEmail(sendSmtpEmail);
    console.log("Verification email sent successfully.");
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Error sending verification email");
  }
};

export { sendVerificationEmail };
