const nodemailer = require("nodemailer");
const {
    hashValue
} = require('../utils/hash');
const UserVerification = require('../models/UserVerification');
const OTPVerification = require('../models/OTPVerification');
const PasswordReset = require('../models/PasswordReset');
const {
    v4: uuidv4
} = require('uuid');
const {
    generateOTP
} = require('./otp.service');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.error("Email server connection error:", error);
    } else {
        console.log("Email server is connected and ready to send messages.");
    }
});

const sendEmail = async (mailOptions) => {
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", info.response);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};

const sendOTPVerificationEmail = async (user) => {
    const otp = generateOTP();

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Verify your Email with OTP",
        html: `<p>Your OTP for verification is: <strong>${otp}</strong></p>
               <p>This OTP will expire in 5 minutes.</p>`
    };

    const hashedOTP = await hashValue(otp);
    await OTPVerification.deleteMany({
        userId: user._id
    });
    const otpVerification = new OTPVerification({
        userId: user._id,
        otp: hashedOTP,
        createdAt: Date.now(),
        expiresAt: Date.now() + 5 * 60 * 1000
    });
    await otpVerification.save();
    await sendEmail(mailOptions);
};


module.exports = {
    sendOTPVerificationEmail
};