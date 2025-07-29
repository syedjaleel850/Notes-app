// src/utils/mailer.ts
import nodemailer from 'nodemailer';

export const sendOtpEmail = async (email: string, otp: string) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const mailOptions = {
            from: `"Notes App" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Your OTP Code for Notes App',
            html: `<p>Your One-Time Password (OTP) is: <strong>${otp}</strong></p><p>It is valid for 10 minutes.</p>`,
        };

        await transporter.sendMail(mailOptions);
        console.log('OTP email sent successfully.');
        return true;
    } catch (error) {
        console.error('Error sending OTP email:', error);
        return false;
    }
};
