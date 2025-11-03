import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const sendEmail = async (to: string, code: string, examTitle: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or use your preferred SMTP service
    auth: {
      user: process.env.EMAIL_USER,     // your email
      pass: process.env.EMAIL_PASS,     // your password or app password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: `Exam Access Code for ${examTitle}`,
    text: `Hi,\n\nYour access code for "${examTitle}" is: ${code}\n\nGood luck!`,
  };

  await transporter.sendMail(mailOptions);
};
