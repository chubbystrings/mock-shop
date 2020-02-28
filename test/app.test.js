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
let userToken;
let productIdForCart;
let cartId;

before(async () => {
  const adminData = await request(app)
    .post('/api/v1/auth/signin')
    .send({
      email: 'martins@yahoo.com',
      password: '1234567',
    })
    .expect(200);
  const adminToken = adminData.body.data.token;

  const productData = await request(app)
    .post('/api/v1/products/product/add')
    .set('authorization', `Bearer ${adminToken}`)
    .field('name', 'Polo Shirt')
    .field('description', 'A Polo by ralph lauren shirt')
    .field('category', 'clothes')
    .field('price', 15000.00)
    .field('inStock', true)
    .attach('image', './test/fixtures/my_anime_resized.png')
    .expect(201);
  productIdForCart = productData.body.data.id;
});

after(async () => {
  const adminData = await request(app)
    .post('/api/v1/auth/signin')
    .send({
      email: 'martins@yahoo.com',
      password: '1234567',
    })
    .expect(200);

  await request(app)
    .delete(`/api/v1/products/product/${productIdForCart}`)
    .set('authorization', `Bearer ${adminData.body.data.token}`)
    .expect(200);
  await pool.query('TRUNCATE TABLE cart CASCADE');
  await pool.query('TRUNCATE TABLE products CASCADE');
});

describe('Users Test', () => {
  it('Users can signup', async () => {
    await request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstName: 'izu',
        lastName: 'okwor',
        email: 'izu@yahoo.com',
        password: '1234567',
      })
      .expect(201);
    await pool.query('delete from users where email = $1', ['izu@yahoo.com']);
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
    await request(app).delete(`/api/v1/products/product/${productData.body.data.id}`);
  });

  it('Admin can edit a product', async () => {
    const productData = await request(app)
      .put(`/api/v1/products/product/${productId}`)
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

describe('Users ', () => {
  before(async () => {
    const userData = await request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'ebube@yahoo.com',
        password: '1234567',
      })
      .expect(200);
    userToken = userData.body.data.token;

    const cartData = await request(app)
      .post(`/api/v1/cart/${productIdForCart}`)
      .set('authorization', `Bearer ${userToken}`)
      .expect(200);
    expect(cartData.body.status).to.equal('successful');
    cartId = cartData.body.data.id;
  });

  it('User can add product to cart', async () => {
    const cartData = await request(app)
      .post(`/api/v1/cart/${productIdForCart}`)
      .set('authorization', `Bearer ${userToken}`)
      .expect(200);
    expect(cartData.body.status).to.equal('successful');
  });

  it('User can see products in cart', async () => {
    const cartData = await request(app)
      .get('/api/v1/cart')
      .set('authorization', `Bearer ${userToken}`)
      .expect(200);
    expect(cartData.body.status).to.equal('successful');
  });

  it('User can remove product from cart', async () => {
    const cartData = await request(app)
      .delete(`/api/v1/cart/${cartId}`)
      .set('authorization', `Bearer ${userToken}`)
      .expect(200);
    expect(cartData.body.status).to.equal('successful');
  });

  it('User cannot Create/Add product', async () => {
    await request(app)
      .post('/api/v1/products/product/add')
      .set('authorization', `Bearer ${userToken}`)
      .field('name', 'combat shorts')
      .field('description', 'A Polo by ralph shorts')
      .field('category', 'clothes')
      .field('price', 15000.00)
      .field('inStock', true)
      .attach('image', './test/fixtures/my_anime_resized.png')
      .expect(401);
  });

  it('User cannot edit a Product', async () => {
    await request(app)
      .put(`/api/v1/products/product/${productIdForCart}`)
      .set('authorization', `Bearer ${userToken}`)
      .field('name', 'LG Television')
      .field('description', 'LG flat screen 53 inch LED TV')
      .field('category', 'electronics')
      .field('price', 250000.00)
      .field('inStock', true)
      .attach('image', './test/fixtures/my_anime_resized.png')
      .expect(401);
  });

  it('User cannot Delete a Product', async () => {
    await request(app)
      .delete(`/api/v1/products/product/${productIdForCart}`)
      .set('authorization', `Bearer ${userToken}`)
      .expect(401);
  });
});

describe('Products Feed', () => {
  it('Admin/Users can see all products', async () => {
    const productData = await request(app)
      .get('/api/v1/products')
      .expect(200);
    expect(productData.body.status).to.equal('successful');
  });
});
