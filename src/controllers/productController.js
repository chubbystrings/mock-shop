/* eslint-disable no-console */
const cloudinary = require('cloudinary').v2;
const pool = require('../database/database.js');

cloudinary.config({

  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,

});

// Users/Admin can view Products

exports.viewAllProducts = async (request, response) => {
  try {
    const { rows, rowCount } = await pool.query('SELECT id, name, description, category, price, imageurl, instock  FROM products INNER JOIN category ON products.categoryid = category.catid');

    if (!rows || rowCount === 0) {
      return response.status(404).send({
        status: 'error',
        error: 'No products found',
      });
    }

    return response.status(200).send({
      status: 'successful',
      data: {
        ...rows,
      },
    });
  } catch (error) {
    return response.status(500).send({
      status: 'error',
      error,
    });
  }
};
// Admin can Add Product
exports.addProduct = async (request, response) => {
  if (!request.method === 'POST') {
    return response.status(405).send({
      status: 'error',
      error: `${request.method} method not allowed`,
    });
  }
  if (!request.file) return response.status(400).send({ status: 'error', error: 'Please upload product photo' });

  try {
    const {
      name, description, category, price, inStock,
    } = request.body;

    const { path } = request.file;
    const newName = request.user.USERID;
    const uniqueFilename = `${newName}-${new Date().toISOString()}`;

    let CAT;
    switch (category) {
      case 'clothes':
        CAT = 1;
        break;
      case 'electronics':
        CAT = 2;
        break;
      case 'books':
        CAT = 3;
        break;
      default:
        return response.status(400).send({ status: 'error', error: 'Category Not found' });
    }

    const resultData = await cloudinary.uploader.upload(path,
      { public_id: `mockshop/${uniqueFilename}` },
      (error, result) => {
        if (error) {
          console.log(error);
          return response.status(500).send({
            status: 'error',
            error,
          });
        }

        return result;
      });
    const productData = await pool.query('INSERT INTO products (name, description, categoryid, price, imageurl, publicid, instock, createdon) VALUES ($1, $2, $3, $4, $5, $6, $7, now()) returning *', [name, description, CAT, price, resultData.url, resultData.public_id, inStock]);
    if (!productData.rows || productData.rowCount === 0) {
      return response.status(500).send({
        status: 'error',
        error: 'Unknown occurred',
      });
    }
    return response.status(201).send({
      status: 'successful',
      data: {
        message: 'Product uploaded successfully',
        id: productData.rows[0].id,
        imageUrl: productData.rows[0].imageurl,
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

// Admin can Edit product
exports.editProduct = async (request, response) => {
  const {
    name, description, category, price, inStock,
  } = request.body;
  if (!name || !description || !category || !price || !inStock) {
    return response.status(400).send({
      status: 'error',
      error: 'One or more field cannot be empty',
    });
  }
  const productId = request.params.productid;
  if (!productId) return response.status(400).send({ status: 'error', error: 'Bad request' });
  let CAT;
  switch (category) {
    case 'clothes':
      CAT = 1;
      break;
    case 'electronics':
      CAT = 2;
      break;
    case 'books':
      CAT = 3;
      break;
    default:
      return response.status(400).send({ status: 'error', error: 'Category Not found' });
  }
  try {
    if (request.file) {
      const getPublicId = await pool.query('SELECT * from products WHERE products.id = $1', [productId]);
      if (!getPublicId.rows || getPublicId.rowCount === 0) {
        return response.status(400).send({
          status: 'error',
          error: 'Not authorized',
        });
      }
      const oldPublicId = getPublicId.rows[0].publicid;
      const { path } = request.file;
      const newName = request.user.USERID;
      const uniqueFilename = `${newName}-${new Date().toISOString()}`;

      const resultData = await cloudinary.uploader.upload(path,
        { public_id: `mockshop/${uniqueFilename}` },
        (error, result) => {
          if (error) {
            console.log(error);
            return response.status(500).send({
              status: 'error',
              error,
            });
          }

          return result;
        });

      const { rows, rowCount } = await
      pool.query('UPDATE products SET name = $1, description = $2, categoryid = $3, price = $4, instock = $5, imageurl = $6, publicid = $7, updatedon = now() returning *', [name, description, CAT, price, inStock, resultData.url, resultData.public_id]);
      if (!rows || rowCount === 0) {
        return response.status(400).send({
          status: 'error',
          error: 'product cannot be updated at the moment',
        });
      }

      cloudinary.uploader.destroy(oldPublicId, (error, result) => {
        if (error || !result) {
          response.status(500).send({ status: 'error', error: 'could not delete from server' });
          console.log(error);
        }
      });

      return response.status(200).send({
        status: 'successful',
        data: {
          message: 'Updated Successfully',
          id: rows[0].id,
          imageUrl: resultData.url,
        },
      });
    }
    const { rows, rowCount } = await
    pool.query('UPDATE products SET name = $1, description = $2, category = $3, price = $4, instock = $5, updatedon = now() returning *', [name, description, CAT, price, inStock]);
    if (!rows || rowCount === 0) {
      return response.status(400).send({
        status: 'error',
        error: 'product cannot be updated at the moment',
      });
    }
    return response.status(200).send({
      status: 'successful',
      data: {
        message: 'Updated Successfully',
        id: rows[0].id,
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

// Admin can delete product

exports.deleteProduct = async (request, response) => {
  const productId = request.params.productid;
  if (!productId) {
    return response.status(401).send({
      status: 'error',
      error: 'Not authorized or Bad request',
    });
  }
  try {
    const deletedData = await pool.query('DELETE FROM products WHERE id = $1 returning *', [productId]);
    if (!deletedData.rows || deletedData.rowCount === 0) {
      return response.status(400).send({
        status: 'error',
        error: 'Could not delete Product, Bad request',
      });
    }

    return cloudinary.uploader.destroy(deletedData.rows[0].publicid, (error, result) => {
      if (error || !result) {
        console.log(error);
      }

      return response.status(200).send({
        status: 'successful',
        data: {
          message: 'deleted Successfully',
        },
      });
    });
  } catch (error) {
    return response.status(500).send({
      status: 'error',
      error,
    });
  }
};
