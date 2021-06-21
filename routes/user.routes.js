const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');

router.route('/signup').post(userController.validate('signup'), userController.signup);
router.route('/verify').post(userController.validate('verifyEmail'), userController.verifyEmail);

module.exports = router;
