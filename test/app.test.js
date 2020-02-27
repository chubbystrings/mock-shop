/* eslint-disable no-console */
/* eslint-disable no-undef */
const request = require('supertest');
const chai = require('chai');
const app = require('../src/app');
const pool = require('../src/database/database');

// eslint-disable-next-line no-unused-vars
const { expect } = chai;

// eslint-disable-next-line no-unused-vars
let productId;
let token;
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

describe('Products', () => {
  before(async () => {
    const adminData = await request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'martins@yahoo.com',
        password: '1234567',
      })
      .expect(200);

    token = adminData.body.data.token;

    const productData = await request(app)
      .post('/api/v1/products/product/add')
      .set('authorization', `Bearer ${token}`)
      .field('name', 'LG TV')
      .field('description', 'Flat screen 53 inch Lg Television')
      .field('category', 'electronics')
      .field('price', 200000.00)
      .field('inStock', true)
      .attach('image', './test/fixtures/my_anime_resized.png')
      .expect(201);
    productId = productData.body.data.id;
  });


  it('Admin can add product', async () => {
    const productData = await request(app)
      .post('/api/v1/products/product/add')
      .set('authorization', `Bearer ${token}`)
      .field('name', 'The Legend')
      .field('description', 'An epic book by emeka')
      .field('category', 'books')
      .field('price', 3000.00)
      .field('inStock', true)
      .attach('image', './test/fixtures/my_anime_resized.png')
      .expect(201);
    expect(productData.body.data).to.have.property('imageUrl');
    expect(productData.body.data).to.have.property('id');
    await request(app).delete(`/api/v1/products/${productData.body.data.id}`);
  });

  it('Admin can edit a product', async () => {
    const productData = await request(app)
      .patch(`/api/v1/products/product/${productId}`)
      .set('authorization', `Bearer ${token}`)
      .field('name', 'LG Television')
      .field('description', 'LG flat screen 53 inch LED TV')
      .field('category', 'electronics')
      .field('price', 250000.00)
      .field('inStock', true)
      .attach('image', './test/fixtures/my_anime_resized.png')
      .expect(200);
    expect(productData.body.data).to.have.property('imageUrl');
  });

  it('Admin can delete a product', async () => {
    await request(app)
      .delete(`/api/v1/products/product/${productId}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });
});
