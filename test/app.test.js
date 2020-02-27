/* eslint-disable no-console */
/* eslint-disable no-undef */
const request = require('supertest');
const chai = require('chai');
const app = require('../src/app');
const pool = require('../src/database/database');

// eslint-disable-next-line no-unused-vars
const { expect } = chai;

describe('Users Test', () => {
  it('Users can signup', async () => {
    const userData = await request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstName: 'izu',
        lastName: 'okwor',
        email: 'izu@yahoo.com',
        password: '1234567',
      })
      .expect(201);
    await pool.query('delete from users where id = $1', [userData.body.data.id]);
  });

  it('Users can signin', async () => {
    const userData = await request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'ebube@yahoo.com',
        password: '1234567',
      })
      .expect(200);
    expect(userData.body.data).to.have.property('token');
  });
});
