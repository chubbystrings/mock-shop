/* eslint-disable no-console */

const pool = require('../database/database.js');
const Validation = require('../middleware/validations/userValidations');

exports.signUp = async (request, response) => {
  try {
    const {
      firstName, lastName, email, password,
    } = request.body;

    if (!firstName) return response.status(400).send({ status: 'error', error: 'Firstname cannot be empty' });
    if (!lastName) return response.status(400).send({ status: 'error', error: 'lastname cannot be empty' });
    if (!email) return response.status(400).send({ status: 'error', error: 'email cannot be empty' });
    if (!password) return response.status(400).send({ status: 'error', error: 'password cannot be empty' });

    if (!Validation.isValidEmail(email)) return response.status(400).send({ status: 'error', error: 'Invalid Email' });
    if (!Validation.passwordLength(password)) return response.status(400).send({ status: 'error', error: 'Password too short' });
    if (!Validation.checkForChar(firstName)) return response.status(400).send({ status: 'error', error: 'characters not allowed' });
    if (!Validation.checkForChar(lastName)) return response.status(400).send({ status: 'error', error: 'characters not allowed' });

    const hashedPassWord = Validation.hashPassword(password);
    const { rows, rowCount } = await pool.query('INSERT INTO users (firstName, lastName, email, password, createdon) VALUES( $1, $2, $3, $4, now()) returning *', [firstName, lastName, email, hashedPassWord]);
    if (!rows || rowCount === 0) {
      return response.status(400).send({
        status: 'error',
        error: 'Invalid Request',
      });
    }

    return response.status(201).send({
      status: 'success',
      data: {
        message: 'Account Created successfully',
        id: rows[0].id,
        email: rows[0].email,
        isAdmin: rows[0].isadmin,
      },
    });
  } catch (error) {
    if (error.routine === '_bt_check_unique') {
      return response.status(500).send({ status: 'error', error: 'email already exist' });
    }
    console.log(error);
    return response.status(500).send({
      status: 'error',
      error,
    });
  }
};

exports.signIn = async (request, response) => {
  try {
    const { email, password } = request.body;

    if (!email) return response.status(400).send({ status: 'error', error: 'email cannot be empty' });
    if (!password) return response.status(400).send({ status: 'error', error: 'Password cannot be empty' });

    const { rows, rowCount } = await pool.query('SELECT * FROM users WHERE users.email = $1', [email]);
    if (!rows || rowCount === 0) {
      return response.status(404).send({
        status: 'error',
        error: 'email or password Incorrect',
      });
    }

    if (!Validation.comparePassword(rows[0].password, password)) {
      return response.status(401).send({ status: 'error', error: ' email or password is incorrect' });
    }

    const token = Validation.generateToken(rows[0].id);

    const resultData = await pool.query('UPDATE users SET rememberToken = $1 WHERE id = $2 returning *', [token, rows[0].id]);

    return response.status(200).send({
      status: 'success',
      data: {
        token,
        userId: resultData.rows[0].id,
      },
    });
  } catch (error) {
    console.log(error);
    return response.status(500).send({ status: 'error', error });
  }
};
