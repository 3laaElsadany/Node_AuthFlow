const bcrypt = require("bcrypt");

const hashValue = async (value) => {
  return await bcrypt.hash(value, bcrypt.genSaltSync(10));
};

const compareHash = async (value, hashed) => {
  return await bcrypt.compare(value, hashed);
};

module.exports = {
  hashValue,
  compareHash
};