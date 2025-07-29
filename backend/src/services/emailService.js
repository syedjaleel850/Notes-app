import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();


console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? '*****' : 'MISSING or EMPTY');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error('Error verifying SMTP transporter:', error);
  } else {
    console.log('SMTP transporter is ready to send emails');
  }
});

export const sendOtpEmail = async (to, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Your OTP for Notes App Verification',
    html: `
      <div style="font-family: sans-serif; text-align: center; padding: 20px;">
        <h2>Email Verification</h2>
        <p>Thank you for registering. Please use the following One-Time Password (OTP) to verify your email address.</p>
        <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px; background-color: #f0f0f0; padding: 10px; border-radius: 5px;">${otp}</p>
        <p>This OTP will expire in 10 minutes.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to ${to}`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
    throw error; 
  }
};
