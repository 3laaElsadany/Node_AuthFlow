const isValidEmail = (email) => {
  return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
};

const isValidName = (name) => {
  return /^[a-zA-Z ]+$/.test(name);
};

const isValidDate = (date) => {
  return !(isNaN(new Date(date).getTime()));
};

const isValidPassword = (password) => {
  return password.length >= 8;
};

module.exports = {
  isValidEmail,
  isValidName,
  isValidDate,
  isValidPassword,
};