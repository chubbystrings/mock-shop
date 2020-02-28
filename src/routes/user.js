const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');

/**
 * @swagger
 *  components:
 *    schemas:
 *      User:
 *        type: object
 *        required:
 *          - name
 *          - email
 *        properties:
 *          name:
 *            type: string
 *          email:
 *            type: string
 *            format: email
 *            description: Email for the user, needs to be unique.
 *        example:
 *           name: Alexander
 *           email: fake@email.com
 */

router.post('/signup', userController.signUp);
router.post('/signin', userController.signIn);


module.exports = router;
