const {
  isValidName,
  isValidEmail,
  isValidPassword,
  isValidDate
} = require('../utils/validators');

const validateSignup = (req, res, next) => {
  let {
    name,
    email,
    password,
    dateOfBirth
  } = req.body;

  name = name ? name.trim() : '';
  email = email ? email.trim() : '';
  password = password ? password.trim() : '';
  dateOfBirth = dateOfBirth ? dateOfBirth.trim() : '';

  if (!name || !email || !password || !dateOfBirth) {
    return res.status(400).json({
      status: 'Failed',
      message: 'Empty input fields are not allowed'
    });
  }
  if (!isValidName(name)) {
    return res.status(400).json({
      status: 'Failed',
      message: 'Name should only contain alphabets'
    });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({
      status: 'Failed',
      message: 'Invalid email format'
    });
  }
  if (!isValidPassword(password)) {
    return res.status(400).json({
      status: 'Failed',
      message: 'Password should be at least 8 characters long'
    });
  }
  if (!isValidDate(dateOfBirth)) {
    return res.status(400).json({
      status: 'Failed',
      message: 'Invalid date of birth'
    });
  }
  next(); 
};

const validateLogin = (req, res, next) => {
  let {
    email,
    password
  } = req.body;

  email = email ? email.trim() : '';
  password = password ? password.trim() : '';

  if (!email || !password) {
    return res.status(400).json({
      status: 'Failed',
      message: 'Empty input fields are not allowed'
    });
  }
  next();
};

const validateVerifyOTP = (req, res, next) => {
  const {
    userId,
    otp
  } = req.body;
  if (!userId || !otp) {
    return res.status(400).json({
      status: 'Failed',
      message: 'User ID and OTP are required'
    });
  }
  next();
};

const validateResend = (req, res, next) => {
  const {
    userId,
    email
  } = req.body;
  if (!userId || !email) {
    return res.status(400).json({
      status: 'Failed',
      message: 'User ID and email are required'
    });
  }
  next();
};

const validateRequestPasswordReset = (req, res, next) => {
  const {
    email,
    redirectUrl
  } = req.body;
  if (!email || !redirectUrl) {
    return res.status(400).json({
      status: 'Failed',
      message: 'Email and redirect URL are required'
    });
  }
  next();
};

const validateResetPassword = (req, res, next) => {
  const {
    userId,
    resetString,
    newPassword
  } = req.body;
  if (!userId || !resetString || !newPassword) {
    return res.status(400).json({
      status: 'Failed',
      message: 'User ID, reset string, and new password are required'
    });
  }
  if (!isValidPassword(newPassword)) {
    return res.status(400).json({
      status: 'Failed',
      message: 'New password should be at least 8 characters long'
    });
  }
  next();
};

module.exports = {
  validateSignup,
  validateLogin,
  validateVerifyOTP,
  validateResend,
  validateRequestPasswordReset,
  validateResetPassword
};