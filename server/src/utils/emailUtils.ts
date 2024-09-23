import nodemailer from "nodemailer";

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    export const sendResetTokenEmail = async (email: string, token: string) => {
      try {
    const mailOptions = {
      from: "Luay Asaadsson <luay.asaadsson@chasacademy.se>",
      to: email,
      subject: "Password Reset Request",
      text: `You requested a password reset. Use the following token: ${token}`,
      html: `<p>You requested a password reset.</p><p>Use the following token:</p><h3>${token}</h3>`,
    };

    await transporter.sendMail(mailOptions);

    console.log(`Password reset token sent to ${email}`);
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Failed to send password reset email");
  }
};
