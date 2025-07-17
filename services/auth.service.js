const User = require('../models/User');
const UserVerification = require('../models/UserVerification');
const PasswordReset = require('../models/PasswordReset');
const OTPVerification = require('../models/OTPVerification');
const {
  hashValue,
  compareHash
} = require('../utils/hash');
const {
  generateToken
} = require('../utils/jwt');
const {
  sendOTPVerificationEmail,
  sendVerificationEmail,
  sendPasswordResetEmail
} = require('./email.service');
require('dotenv').config();

const handleModel = async (model, key, value, action = 'find') => {
  const query = {
    [key]: value
  };
  if (action === 'find') {
    return await model.findOne(query);
  } else if (action === 'delete') {
    return await model.deleteMany(query);
  } else {
    throw new Error('Invalid action type. Use "find" or "delete".');
  }
};

const signupUser = async (name, email, password, dateOfBirth) => {
  const existingUser = await handleModel(User, 'email', email, 'find');
  if (existingUser) {
    throw new Error('User already exists with this email');
  }

  const hashedPassword = await hashValue(password);
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    dateOfBirth
  });
  const savedUser = await newUser.save();

  await sendOTPVerificationEmail(savedUser);

  return {
    userId: savedUser._id,
    email: savedUser.email
  };
};

const loginUser = async (email, password) => {
  const user = await handleModel(User, 'email', email, 'find');

  if (!user || !(await compareHash(password, user.password))) {
    throw new Error('Invalid email or password');
  }

  if (!user.verified) {
    throw new Error('Please verify your email before logging in');
  }

  const token = generateToken({
    id: user._id
  });
  return {
    token,
    user: {
      name: user.name,
      email: user.email,
      dateOfBirth: new Date(user.dateOfBirth).toLocaleDateString()
    }
  };
};

const verifyUserOTP = async (userId, otp) => {
  const otpVerification = await handleModel(OTPVerification, 'userId', userId, 'find');

  if (!otpVerification) {
    throw new Error('OTP verification request not found');
  }
  if (otpVerification.expiresAt < Date.now()) {
    await handleModel(OTPVerification, 'userId', userId, 'delete');
    throw new Error('OTP has expired, please request a new one');
  }

  const isMatch = await compareHash(otp, otpVerification.otp);
  if (!isMatch) {
    throw new Error('Invalid OTP');
  }

  await User.updateOne({
    _id: userId
  }, {
    verified: true
  });
  await handleModel(OTPVerification, 'userId', userId, 'delete');
  return true;
};

const resendUserOTPVerification = async (userId, email) => {
  const user = await User.findOne({
    _id: userId,
    email
  });
  if (!user) {
    throw new Error('User not found');
  }
  if (user.verified) {
    throw new Error('Email is already verified');
  }
  await handleModel(OTPVerification, 'userId', userId, 'delete');
  await sendOTPVerificationEmail(user);
  return {
    userId: user._id,
    email: user.email
  };
};

const requestUserPasswordReset = async (email, redirectUrl) => {
  const user = await handleModel(User, 'email', email, 'find');
  if (!user) {
    throw new Error('User not found with this email');
  }
  if (!user.verified) {
    throw new Error('Please verify your email before requesting a password reset');
  }
  await sendPasswordResetEmail(user, redirectUrl);
  return true;
};

const resetUserPassword = async (userId, resetString, newPassword) => {
  const passwordReset = await handleModel(PasswordReset, 'userId', userId, 'find');
  if (!passwordReset) {
    throw new Error('Invalid password reset request');
  }
  if (passwordReset.expiresAt < Date.now()) {
    await handleModel(PasswordReset, 'userId', userId, 'delete');
    throw new Error('Password reset link has expired, please request a new one');
  }

  const isMatch = await compareHash(resetString, passwordReset.resetString);
  if (!isMatch) {
    throw new Error('Invalid password reset link');
  }

  const hashedPassword = await hashValue(newPassword);
  await User.updateOne({
    _id: userId
  }, {
    password: hashedPassword
  });
  await handleModel(PasswordReset, 'userId', userId, 'delete');
  return true;
};

const verifyUserEmail = async (userId, uniqueString) => {
  const userVerification = await handleModel(UserVerification, 'userId', userId, 'find');
  if (!userVerification) {
    throw new Error('Verification link is invalid or has expired');
  }

  if (userVerification.expiresAt < Date.now()) {
    await handleModel(UserVerification, 'userId', userId, 'delete');
    await User.deleteOne({
      _id: userId
    });
    throw new Error('Verification link has expired, please sign up again');
  }

  const hashedUniqueString = userVerification.uniqueString;
  const isMatch = await compareHash(uniqueString, hashedUniqueString);
  if (!isMatch) {
    throw new Error('Invalid verification link');
  }

  await User.updateOne({
    _id: userId
  }, {
    verified: true
  });
  await handleModel(UserVerification, 'userId', userId, 'delete');
  return true;
};

const resendUserVerificationEmail = async (userId, email) => {
  const user = await User.findOne({
    _id: userId,
    email
  });
  if (!user) {
    throw new Error('User not found');
  }
  if (user.verified) {
    throw new Error('Email is already verified');
  }
  await handleModel(UserVerification, 'userId', userId, 'delete');
  await sendVerificationEmail(user);
  return {
    userId: user._id,
    email: user.email
  };
};

const getProfile = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};


module.exports = {
  signupUser,
  loginUser,
  verifyUserOTP,
  resendUserOTPVerification,
  requestUserPasswordReset,
  resetUserPassword,
  verifyUserEmail,
  resendUserVerificationEmail,
  getProfile
};