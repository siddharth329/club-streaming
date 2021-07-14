const asyncHandler = require('express-async-handler');
const createError = require('http-errors');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult, query } = require('express-validator/check');
const { PrismaClient } = require('@prisma/client');

const { mail } = require('../services/mail');

const { user, token } = new PrismaClient();

exports.validate = (method) => {
	switch (method) {
		case 'signup': {
			return [
				body('email', 'invalid email address').notEmpty().isEmail(),
				body('password', 'password validation failed').matches(
					/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
					'i'
				),
				body('name', 'invalid user name')
					.notEmpty()
					.isLength({ min: 5, max: 20 })
					.isString()
			];
		}

		case 'verifyEmail': {
			return [ query('token', 'somethings wrong with token').notEmpty().isHexadecimal() ];
		}

		case 'login': {
			return [
				body('email', 'invalid email value').isEmail(),
				body('password', 'invalid password value').isString()
			];
		}

		case 'requestForgotPassword': {
			return [ body('email', 'invalid email').notEmpty().isEmail() ];
		}

		case 'forgot': {
			return [
				query('token', 'somethings wrong with token').notEmpty().isHexadecimal(),
				body('password', 'password validation failed').matches(
					/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
					'i'
				)
			];
		}
	}
};

//-------------------------------------------------------------
// ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
//-------------------------------------------------------------

/**
* @api {post} /api/user Create user
* @apiName Create new user
* @apiPermission user, admin
* @apiGroup User
*
* @apiParam  {String} [userName] username
* @apiParam  {String} [email] Email
* @apiParam  {String} [firstName] String First Name
* @apiParam  {String} [lastName] String Last Name
*
* @apiSuccess (200) {Object} mixed `User` object
*/

exports.signup = asyncHandler(async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(422).json({ errors: errors.array({ onlyFirstError: true }) });
		return;
	}

	const { email, name, password } = req.body;

	const userExists = await user.findUnique({ where: { email } });
	if (userExists) {
		return next(createError(403, 'user with this email already exists'));
	}

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	const newUser = await user.create({
		data: {
			email,
			name,
			password: hashedPassword
		},
		select: {
			id: true,
			email: true,
			name: true,
			createdAt: true,
			role: true,
			verified: true
		}
	});

	const generatedToken = crypto.randomBytes(32).toString('hex');

	await token.create({
		data: {
			expiration: new Date(Date.now() + 900000), // 15 minutes (900 secs) from now
			type: 'EMAIL_VERIFICATION',
			value: generatedToken,
			user_id: newUser.id
		}
	});

	const verificationURI = `${process.env.CLIENT_URL}/api/user/verify?token=${generatedToken}`;

	await mail({
		to: email,
		subject: 'Verification Email for signup on club streaming',
		html: `
			<body>
				<h2>Verify your identity</h2>
				<p>This email was sent to verify the signup for Club Streaming from this email. Ignore the email if it was not done by you</p>
				<a style="display: inline-block; padding: 10px 20px; background: grey;" href=${verificationURI} target="_blank" rel="noopener noreferrer">Verify Email</a>
			</body>
		`
	});

	res.status(201).json(newUser);
});

//-------------------------------------------------------------
// ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
//-------------------------------------------------------------

exports.verifyEmail = asyncHandler(async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(422).json({ errors: errors.array({ onlyFirstError: true }) });
		return;
	}

	const { token: userToken } = req.query;

	const tokenData = await token.findFirst({
		where: { value: userToken, type: 'EMAIL_VERIFICATION' }
	});

	// Send error if no token found or the token expired
	if (!tokenData || tokenData.expiration.getTime() < new Date().getTime()) {
		return next(createError(400, 'Invalid token'));
	}

	await user.update({ where: { id: tokenData.user_id }, data: { verified: true } });

	await token.delete({ where: { id: tokenData.id } });

	res.status(200).json({ msg: 'Email verified successfully' });
});

//-------------------------------------------------------------
// ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
//-------------------------------------------------------------

exports.login = asyncHandler(async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(422).json({ errors: errors.array({ onlyFirstError: true }) });
		return;
	}

	const { email, password } = req.body;

	const userData = await user.findFirst({ where: { email } });

	if (
		!userData ||
		!userData.verified ||
		!userData.active ||
		!await bcrypt.compare(password, userData.password)
	) {
		return next(createError(401, 'invalid email or password'));
	}

	const signedToken = await jwt.sign(
		{ userId: userData.id },
		process.env.JWT_AUTHORIZATION_SECRET,
		{ expiresIn: '30d' }
	);

	res.cookie('token', signedToken, { maxAge: 2592000000 });

	res.status(200).json({
		id: userData.id,
		email: userData.email,
		name: userData.name,
		isPaid: userData.isPaid,
		planExpiry: userData.planExpiry,
		role: userData.role,
		token: signedToken
	});
});

//-------------------------------------------------------------
// ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
//-------------------------------------------------------------

exports.logout = asyncHandler(async (req, res, next) => {
	res.cookie('token', 'logged out', { maxAge: 10 });
	res.status(200).json({ msg: 'user logged out successfully' });
});

//-------------------------------------------------------------
// ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
//-------------------------------------------------------------

exports.requestForgotPassword = asyncHandler(async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(422).json({ errors: errors.array({ onlyFirstError: true }) });
		return;
	}

	const { email } = req.body;

	const generatedToken = crypto.randomBytes(32).toString();

	const userData = await user.findFirst({
		where: { email, active: true, verified: true },
		select: { id: true, email: true }
	});

	if (userData) {
		if (await token.findFirst({ where: { user_id: userData.id, type: 'FORGOT_PASSWORD' } }))
			await token.update({
				data: { value: generatedToken, expiration: new Date(Date.now() + 900000) }
			});
		else
			await token.create({
				data: {
					type: 'FORGOT_PASSWORD',
					value: generatedToken,
					expiration: new Date(Date.now() + 900000), // 15 minutes (900 sec)
					user_id: userData.id
				}
			});

		const resetURI = `${process.env.CLIENT_URL}/api/user/forgot?token=${generatedToken}`;

		await mail({
			to: userData.email,
			subject: 'Forgot password request at Club Streaming',
			html: `
					<body>
						<h2>Verify your identity</h2>
						<p>This email was sent to verify the forgot password request for Club Streaming from this email. Ignore the email if it was not done by you</p>
						<a style="display: inline-block; padding: 10px 20px; background: grey;" href=${resetURI} target="_blank" rel="noopener noreferrer">Reset Password</a>
					</body>
				`
		});
	}

	return res
		.status(200)
		.json({ msg: 'If we find your email in our records, you will recieve email shortly' });
});

//-------------------------------------------------------------
// ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
//-------------------------------------------------------------

exports.forgot = asyncHandler(async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(422).json({ errors: errors.array({ onlyFirstError: true }) });
		return;
	}

	const { token: userToken } = req.query;
	const { password } = req.body;

	const tokenData = await token.findFirst({
		where: { value: userToken, type: 'FORGOT_PASSWORD' }
	});

	// Send error if no token found or the token expired
	if (!tokenData || tokenData.expiration.getTime() < new Date().getTime()) {
		return next(createError(400, 'Invalid token'));
	}

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	await user.update({ where: { id: tokenData.user_id }, data: { password: hashedPassword } });

	res.status(200).json({ msg: 'password reset successfully' });
});

//-------------------------------------------------------------
// ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
//-------------------------------------------------------------

exports.getUserInfo = asyncHandler(async (req, res, next) => {
	res.json({
		id: req.user.id,
		email: req.user.email,
		name: req.user.name,
		role: req.user.role,
		planExpiry: req.user.planExpiry,
		isPaid: req.user.isPaid
	});
});
