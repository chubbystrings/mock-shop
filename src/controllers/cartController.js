/* eslint-disable no-console */
const pool = require('../database/database.js');

exports.addToCart = async (request, response) => {
  const productId = request.params.productid;
  if (!productId) {
    return response.status(400).send({
      status: 'error',
      error: 'Bad request No product Id',
    });
  }

  try {
    const { rows, rowCount } = await pool.query('INSERT INTO cart (productid, userid) VALUES ($1, $2) returning *', [productId, request.user.USERID]);
    if (!rows || rowCount === 0) {
      return response.status(404).send({
        status: 'error',
        error: 'product not found or invalid user',
      });
    }
    return response.status(200).send({
      status: 'successful',
      data: {
        id: rows[0].cartid,
      },
    });
  } catch (error) {
    console.log(error);
    return response.status(500).send({
      status: 'error',
      error,
    });
  }
};

exports.viewCartItems = async (request, response) => {
  try {
    const productData = await pool.query('SELECT id, cartid, name, description, category, price, imageurl, instock FROM products LEFT JOIN cart ON products.id = cart.productid LEFT JOIN category ON products.categoryid = category.catid WHERE cart.userid = $1', [request.user.USERID]);
    if (!productData.rows || productData.rowCount === 0) {
      return response.status(404).send({
        status: 'error',
        error: 'No product found or invalid user',
      });
    }
    return response.status(200).send({
      status: 'successful',
      data: {
        rows: [...productData.rows],
      },
    });
  } catch (error) {
    return response.status(500).send({
      status: 'error',
      error,
    });
  }
};

exports.deleteItemsOnCart = async (request, response) => {
  const cartId = request.params.cartid;

  if (!cartId) {
    return response.status(400).send({
      status: 'error',
      error: 'Bad Request, No cart Id provided',
    });
  }
  try {
    const { rows, rowCount } = await pool.query('DELETE FROM cart WHERE cartid = $1 AND userid = $2 returning *', [cartId, request.user.USERID]);
    if (!rows || rowCount === 0) {
      return response.status(404).send({
        status: 'error',
        error: 'Not Authorized or product is not found',
      });
    }

    return response.status(200).send({
      status: 'successful',
      data: {
        message: 'Item deleted successfully',
      },
    });
  } catch (error) {
    return response.status(500).send({
      status: 'error',
      error,
    });
  }
};
