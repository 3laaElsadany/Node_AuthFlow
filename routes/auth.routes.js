const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/auth.controller');
const passport = require("passport");
const requireAuth = require('../middlewares/auth.middleware');
const {
  validateSignup,
  validateLogin,
  validateVerifyOTP,
  validateResend,
  validateRequestPasswordReset,
  validateResetPassword
} = require('../middlewares/validation.middleware');

// Auth
router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);
router.get("/profile", requireAuth, profile);

// OTP
router.post('/verifyOTP', validateVerifyOTP, verifyOTP);
router.post('/resendOTPVerification', validateResend, resendOTPVerification);

// Email verification (link based)
router.post('/resendVerificationEmail', validateResend, resendVerificationEmail);
router.get('/verify/:userId/:uniqueString', verifyEmail);

// Password reset
router.post('/requestPasswordReset', validateRequestPasswordReset, requestPasswordReset);
router.post('/resetPassword', validateResetPassword, resetPassword);

// Social login
router.get("/social-login", socialLogin);
router.get("/google", passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/cb', passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL}/login`
  }),
  (req, res) => res.redirect(`${process.env.CURRENT_URL}/auth/social-login?id=${req.user.id}`)
);

router.get("/facebook", passport.authenticate('facebook', {
  scope: ['email']
}));
router.get("/facebook/cb", passport.authenticate("facebook", {
    failureRedirect: `${process.env.CLIENT_URL}/login`
  }),
  (req, res) => res.redirect(`${process.env.CURRENT_URL}/auth/social-login?id=${req.user.id}`)
);

module.exports = router;