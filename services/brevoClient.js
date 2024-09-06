import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "brevo",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendVerificationEmail = async (email, verificationLink) => {
  const mailOptions = {
    from: "veronika.karaulov@gmail.com",
    to: email,
    subject: "Please verify your email",
    text: `Click this link to verify your email: ${verificationLink}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully.");
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Error sending verification email");
  }
};
