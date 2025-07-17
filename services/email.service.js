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
const otpGenerator = require('otp-generator');

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
  const otp = otpGenerator.generate(4, {
    upperCaseAlphabets: false,
    specialChars: false
  });

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

const sendVerificationEmail = async (user) => {
  const currentURL = process.env.CURRENT_URL;
  const uniqueString = uuidv4() + user._id;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Verify your email",
    html: `<p>Thank you for signing up! Please verify your email by clicking the link below:</p>
               <a href=${currentURL}/auth/verify/${user._id}/${uniqueString}>Click here to verify your email</a>
               <p>This link will expire in 24 hours.</p>`
  };

  const hashedUniqueString = await hashValue(uniqueString);
  await UserVerification.deleteMany({
    userId: user._id
  });
  const userVerification = new UserVerification({
    userId: user._id,
    uniqueString: hashedUniqueString,
    createdAt: Date.now(),
    expiresAt: Date.now() + 24 * 60 * 60 * 1000
  });
  await userVerification.save();
  await sendEmail(mailOptions);
};

const sendPasswordResetEmail = async (user, redirectUrl) => {
  const resetString = uuidv4() + user._id;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Reset your password",
    html: `<p>Hi ${user.name},</p>
               <p>We received a request to reset your password. Click the link below to reset your password:</p>
               <a href="${redirectUrl}/${user._id}/${resetString}">Reset Password</a>
               <p>This link will expire in 60 minutes.</p>`
  };

  await PasswordReset.deleteMany({
    userId: user._id
  });
  const hashedResetString = await hashValue(resetString);
  const passwordReset = new PasswordReset({
    userId: user._id,
    resetString: hashedResetString,
    createdAt: Date.now(),
    expiresAt: Date.now() + 60 * 60 * 1000
  });
  await passwordReset.save();
  await sendEmail(mailOptions);
};

module.exports = {
  sendOTPVerificationEmail,
  sendVerificationEmail,
  sendPasswordResetEmail
};