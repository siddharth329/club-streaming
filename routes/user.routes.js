const express = require('express');
const router = express.Router();

const {
	signup,
	login,
	logout,
	verifyEmail,
	validate,
	requestForgotPassword,
	forgot,
	getUserInfo
} = require('../controllers/user.controller');

const { protected } = require('../utils/index');

router.route('/signup').post(validate('signup'), signup);
router.route('/verify').get(validate('verifyEmail'), verifyEmail);
router.route('/login').post(validate('login'), login);
router.route('/logout').get(protected(), logout);
router.route('/forgotPassword').post(validate('requestForgotPassword'), requestForgotPassword);
router.route('/forgot').get(validate('forgot'), forgot);

router.route('/info').get(protected(), getUserInfo);

module.exports = router;
