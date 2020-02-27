const express = require('express');

const router = express.Router();

const cartController = require('../controllers/cartController');

const Auth = require('../middleware/auth');

router.get('/', Auth.verifyUserToken, cartController.viewCartItems);
router.post('/:productid', Auth.verifyUserToken, cartController.addToCart);
router.delete('/:cartid', Auth.verifyUserToken, cartController.deleteItemsOnCart);


module.exports = router;
