/* eslint-disable no-console */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const Validation = {

  isEmpty(value) {
    if (!value) return false;
    return true;
  },

  hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
  },

  comparePassword(hashPassword, password) {
    return bcrypt.compareSync(password, hashPassword);
  },

  passwordLength(passwordLength) {
    return passwordLength.length >= 7;
  },

  isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  },

  generateToken(id) {
    const token = jwt.sign({
      userId: id,
    },
    process.env.JWT_SECRET, { expiresIn: '6h' });
    return token;
  },

  hidePrivateData(user) {
    const rows = { ...user };
    delete rows[0].password;
    if (rows[0].remember_token) {
      delete rows[0].remember_token;
    }
    return rows;
  },

  checkForChar(field) {
    const char = /^[a-zA-Z]+$/;
    if (char.test(field)) {
      return true;
    }
    return false;
  },

};

module.exports = Validation;
