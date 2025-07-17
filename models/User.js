const mongoose = require('mongoose');
const schema = mongoose.Schema;

const UserSchema = new schema({
  name: {
    type: String
  },
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String
  },
  dateOfBirth: {
    type: Date
  },
  verified: {
    type: Boolean,
    default: false
  }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;