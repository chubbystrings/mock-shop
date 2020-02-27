const express = require('express');

const router = express.Router();

const productController = require('../controllers/productController');

const Auth = require('../middleware/auth');

const multerUpload = require('../middleware/multer');

router.get('/', productController.viewAllProducts);
router.post('/product/add', Auth.verifyAdminToken, multerUpload, productController.addProduct, (error, req, res, next) => {
  if (error) {
    const { message } = error;
    return res.status(400).send({ status: 'error', error: message });
  }
  next();
  return res.send();
});

router.patch('/product/:productid', Auth.verifyAdminToken, multerUpload, productController.editProduct, (error, req, res, next) => {
  if (error) {
    const { message } = error;
    return res.status(400).send({ status: 'error', error: message });
  }
  next();
  return res.send();
});

router.delete('/product/:productid', Auth.verifyAdminToken, productController.deleteProduct);

module.exports = router;
