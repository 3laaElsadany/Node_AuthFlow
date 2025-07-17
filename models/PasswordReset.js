const mongoose = require('mongoose');
const schema = mongoose.Schema;

const PasswordResetSchema = new schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resetString: {
    type: String
  },
  createdAt: {
    type: Date
  },
  expiresAt: {
    type: Date
  }
});

const PasswordReset = mongoose.model('PasswordReset', PasswordResetSchema);
module.exports = PasswordReset;