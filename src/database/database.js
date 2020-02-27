
const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';
const connectionString = isTest ? `postgres://${process.env.ELEPHANTDB_USER}:${process.env.ELEPHANTDB_PASS}@${process.env.ELEPHANTDB_HOST}:5432/${process.env.ELEPHANTDB_DATABASE}` : `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:5432/${process.env.DB_DATABASE}`;

const pool = new Pool({
  connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
  ssl: isProduction,
});


module.exports = pool;
