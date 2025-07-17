const mongoose = require('mongoose');
const schema = mongoose.Schema;

const OTPVerivicationSchema = new schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  otp: {
    type: String
  },
  createdAt: {
    type: Date
  },
  expiresAt: {
    type: Date
  }
});

const OTPVerivication = mongoose.model('OTPVerivication', OTPVerivicationSchema);
module.exports = OTPVerivication;