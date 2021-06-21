const asyncHandler = require('express-async-handler');
const createError = require('http-errors');
const crypto = require('crypto');
const { body, validationResult, query } = require('express-validator/check');
const { PrismaClient } = require('@prisma/client');

const { mail } = require('../services/mail');

const { user, token } = new PrismaClient();

exports.validate = (method) => {
	switch (method) {
		case 'signup': {
			return [
				body('email', 'invalid email address').notEmpty().isEmail(),
				body('name', 'invalid user name')
					.notEmpty()
					.isLength({ min: 5, max: 20 })
					.isString()
			];
		}

		case 'verifyEmail': {
			return [ query('token', 'somethings wrong with token').isHexadecimal() ];
		}
	}
};

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

	const { email, name } = req.body;

	const userExists = await user.findUnique({ where: { email } });
	if (userExists) {
		return next(createError(403, 'user with this email already exists'));
	}

	const newUser = await user.create({
		data: {
			email,
			name
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
			expiration: new Date(Date.now() + 900), // 15 minutes (900 secs) from now
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

	if (!tokenData) {
		return next(createError(400, 'Invalid token'));
	}

	await user.update({
		where: { id: tokenData.id },
		data: { verified: true }
	});

	res.status(200).json({ msg: 'Email verified successfully' });
});
