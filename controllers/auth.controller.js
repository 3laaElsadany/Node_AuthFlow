const authService = require('../services/auth.service');

const signup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      dateOfBirth
    } = req.body;
    const result = await authService.signupUser(name, email, password, dateOfBirth);
    res.status(201).json({
      status: 'PENDING',
      message: 'Please check your email for the OTP to verify your account.',
      data: result
    });
  } catch (error) {
    res.status(400).json({
      status: 'Failed',
      message: error.message
    });
  }
};

const login = async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body;
    const {
      token,
      user
    } = await authService.loginUser(email, password);
    res.status(200).json({
      status: 'Success',
      message: 'User logged in successfully',
      token: token,
      data: user
    });
  } catch (error) {
    res.status(400).json({
      status: 'Failed',
      message: error.message
    });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const {
      userId,
      otp
    } = req.body;
    await authService.verifyUserOTP(userId, otp);
    res.status(200).json({
      status: 'Success',
      message: 'Your email has been verified successfully',
    });
  } catch (error) {
    res.status(400).json({
      status: 'Failed',
      message: error.message
    });
  }
};

const resendOTPVerification = async (req, res) => {
  try {
    const {
      userId,
      email
    } = req.body;
    const result = await authService.resendUserOTPVerification(userId, email);
    res.status(201).json({
      status: 'PENDING',
      message: 'New OTP sent to your email.',
      data: result
    });
  } catch (error) {
    res.status(400).json({
      status: 'Failed',
      message: error.message
    });
  }
};

const requestPasswordReset = async (req, res) => {
  try {
    const {
      email,
      redirectUrl
    } = req.body;
    await authService.requestUserPasswordReset(email, redirectUrl);
    res.status(200).json({
      status: 'PENDING',
      message: 'Password reset email sent successfully, please check your inbox.'
    });
  } catch (error) {
    res.status(400).json({
      status: 'Failed',
      message: error.message
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const {
      userId,
      resetString,
      newPassword
    } = req.body;
    await authService.resetUserPassword(userId, resetString, newPassword);
    res.status(200).json({
      status: 'Success',
      message: 'Password reset successfully'
    });
  } catch (error) {
    res.status(400).json({
      status: 'Failed',
      message: error.message
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const {
      userId,
      uniqueString
    } = req.params;
    await authService.verifyUserEmail(userId, uniqueString);
    res.status(200).json({
      status: 'Success',
      message: 'Email verified successfully'
    });
  } catch (error) {

    res.status(400).json({
      status: 'Failed',
      message: error.message
    });
  }
};

const resendVerificationEmail = async (req, res) => {
  try {
    const {
      userId,
      email
    } = req.body;
    const result = await authService.resendUserVerificationEmail(userId, email);
    res.status(201).json({
      status: 'PENDING',
      message: 'Please check your email to verify your account.',
      data: result
    });
  } catch (error) {
    res.status(400).json({
      status: 'Failed',
      message: error.message
    });
  }
};

const socialLogin = async (req, res) => {
  try {

    const userId = req.query.id;
    if (!userId) {
      return res.status(400).json({
        message: "User ID is required for social login callback"
      });
    }
    const user = await authService.getProfile(userId);
    res.status(200).json({
      message: "Social login successful",
      data: {
        userId: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal server error during social login",
      error: err.message
    });
  }
};


const profile = async (req, res) => {
  try {
    const user = await authService.getProfile(req.user.id);
    res.status(200).json({
      status: "Success",
      data: user,
    });
  } catch (error) {
    res.status(404).json({
      status: "Failed",
      message: error.message
    });
  }
};

module.exports = {
  signup,
  login,
  verifyOTP,
  resendOTPVerification,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
  socialLogin,
  profile
};