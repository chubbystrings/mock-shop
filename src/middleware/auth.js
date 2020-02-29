/* eslint-disable no-console */
/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const pool = require('../database/database');

const Auth = {
  async verifyUserToken(req, res, next) {
    try {
      if (!req.headers.authorization) {
        return res.status(401).send({
          status: 'error',
          error: 'Unauthorized, Bad request',
        });
      }

      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const { userId } = decodedToken;
      const { rows, rowCount } = await pool.query('SELECT * FROM users WHERE users.id = $1 AND users.remembertoken = $2', [userId, token]);
      if (!rows || rowCount === 0) {
        return res.status(401).send({ status: 'error', error: 'Unauthorized User' });
      }

      const dBToken = jwt.verify(rows[0].remembertoken, process.env.JWT_SECRET);
      if (dBToken.userId !== decodedToken.userId) {
        return res.status(401).send({ status: 'error', error: 'Unauthorized User' });
      }

      req.token = token;
      req.user = { USERID: decodedToken.userId };
      next();
    } catch (error) {
      console.log(error);
      return res.status(401).json({
        status: 'error',
        error: 'Invalid Request, Not Authorized',
      });
    }
  },

  async verifyAdminToken(req, res, next) {
    try {
      if (!req.headers.authorization) {
        return res.status(401).send({
          status: 'error',
          error: 'Unauthorized, Bad request',
        });
      }

      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const { userId } = decodedToken;
      const { rows, rowCount } = await pool.query('SELECT * FROM users WHERE users.id = $1 AND users.remembertoken = $2', [userId, token]);
      if (!rows || rowCount === 0) {
        return res.status(401).send({ status: 'error', error: 'Unauthorized User' });
      }

      const dBToken = jwt.verify(rows[0].remembertoken, process.env.JWT_SECRET);
      if (dBToken.userId !== decodedToken.userId) {
        return res.status(401).send({ status: 'error', error: 'Unauthorized User' });
      }

      if (!rows[0].isadmin) {
        return res.status(401).send({ status: 'error', error: 'Unauthorized user, Admins only' });
      }

      req.token = token;
      req.user = { USERID: decodedToken.userId };
      next();
    } catch (error) {
      console.log(error);
      return res.status(401).json({
        status: 'error',
        error: 'Invalid Request, Not Authorized',
      });
    }
  },
};


module.exports = Auth;
