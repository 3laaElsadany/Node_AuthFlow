# Node_AuthFlow

A secure and modular authentication system built with **Node.js**, **Express**, and **MongoDB**, featuring:

- User Signup & Login
- Email Verification (via OTP or unique link)
- OTP Verification using `otp-generator` & `bcrypt`
- Resend Verification Email or OTP
- Password Reset via Email with Expiration
- Environment Configuration using `.env`
- Secure Email Sending with Nodemailer (Gmail SMTP)
- Built-in Input Validation
- OAuth2 with Google & Facebook

## 📦 Technologies Used

- Node.js & Express.js
- MongoDB & Mongoose
- bcrypt for password & OTP hashing
- nodemailer for sending emails
- otp-generator for secure OTPs
- uuid for unique reset/verification strings
- dotenv for managing environment variables
- passport, passport-google-oauth20, passport-facebook for OAuth2

## 📂 Project Structure

```
/controllers      → Authentication logic
/models           → Mongoose models (User, OTPVerification, etc.)
/routes           → API route handlers for authentication flows
/middlewares      → Custom middleware functions
/services         → Business logic and reusable services
/config           → MongoDB connection and configuration
/utils            → Utility functions (validation, hash, etc.)
.env              → Environment configuration (email credentials, base URL)
server.js         → Entry point for the Express server
```

## 🔐 Features

- OTP verification with expiration handling
- Email link verification with UUID
- Secure password hashing
- Password reset with time-limited tokens
- Full error handling and status messaging
- OAuth2 login via Google and Facebook
- Option to set a password for social login users

## 🌐 OAuth2 with Google & Facebook

OAuth2 authentication is integrated with the most popular identity providers:

- ✅ Sign in with **Google**
- ✅ Sign in with **Facebook**
- ✅ Link an OAuth account to a local account
- ✅ Allow users to set a password after logging in via OAuth

### 🧩 Dependencies Used

- `passport`
- `passport-google-oauth20`
- `passport-facebook`
- `express-session` (for secure session storage)

### 🔧 OAuth Configuration in `.env`
Add the following variables to your `.env` file:

```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_secret_key
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/cb

FACEBOOK_CLIENT_ID=your_facebook_app_id
FACEBOOK_CLIENT_SECRET=your_facebook_app_secret
FACEBOOK_CALLBACK_URL=http://localhost:3000/auth/facebook/cb

PORT=3000
MONGODB_URL=your_mongodb_url

EMAIL_USER=your_email
EMAIL_PASS=your_email_app_password

CURRENT_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=token_expiration_time

SESSION_SECRET=your_session_secret_key
```

### 🚦 Available OAuth Routes

#### 📌 Google
- `GET /auth/google`
- `GET /auth/google/cb`

#### 📌 Facebook
- `GET /auth/facebook`
- `GET /auth/facebook/cb`

### 🔐 Securing Users After OAuth Login

After logging in via Google or Facebook:
- The system checks if the user already exists in the database.
- If not, a new user is created.
- The user can to set a password

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/3laaElsadany/Node_AuthFlow.git
cd Node_AuthFlow
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
### Development mode:
```bash
npm run dev
```
### Production mode:
```bash
npm start
```
