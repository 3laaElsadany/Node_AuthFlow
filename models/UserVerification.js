const mongoose = require('mongoose');
const schema = mongoose.Schema;

const UserVerificationSchema = new schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  uniqueString: {
    type: String
  },
  createdAt: {
    type: Date
  },
  expiresAt: {
    type: Date
  }
});

const UserVerification = mongoose.model('UserVerification', UserVerificationSchema);
module.exports = UserVerification;