const { AppError, httpStatusCodes } = require('../error/createError');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const { param, validationResult } = require('express-validator/check');
const { PrismaClient } = require('@prisma/client');

const { episode, model, user } = new PrismaClient();

exports.orderByGenerator = (q, order) => {
	switch (q) {
		case 'favourites':
			return { favCount: order };
		case 'views':
			return { views: order };
		case 'latest':
			return { createdAt: order };
	}
};

exports.fieldPurifier = (model, field) => {
	return model.findMany({
		where: { OR: [ ...field.map((f) => ({ id: f })) ] },
		select: { id: true }
	});
};

exports.episodeExistsFromParamId = asyncHandler(async (req, res, next) => {
	param('id', 'invalid id').isInt();
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		res.status(422).json({ errors: errors.array() });
		return;
	}

	const episodeExists = await episode.findUnique({
		where: { id: parseInt(req.params.id) }
	});

	if (!episodeExists) {
		return next(new AppError(httpStatusCodes.NOT_FOUND, 'requested episode was not found'));
	}

	next();
});

exports.modelExistsFromParamId = asyncHandler(async (req, res, next) => {
	param('id', 'invalid id').isInt();
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(422).json({ errors: errors.array() });
		return;
	}

	const modelExists = await model.findUnique({
		where: { id: parseInt(req.params.id) }
	});

	if (!modelExists) {
		return next(new AppError(httpStatusCodes.NOT_FOUND, 'requested model was not found'));
	}

	next();
});

exports.protected = (restrictTo) =>
	asyncHandler(async (req, res, next) => {
		restrictTo = restrictTo || [ 'USER', 'PREMIUM', 'ADMIN' ];

		const token =
			req.headers.authorization &&
			req.headers.authorization.startsWith('Bearer') &&
			req.headers.authorization.includes(' ')
				? req.headers.authorization.split(' ')[1]
				: req.cookies.token;

		if (!token) {
			return next(new AppError(httpStatusCodes.UN_AUTHORIZED, 'unauthorized access'));
		}

		let decodedToken;
		try {
			decodedToken = jwt.verify(token, process.env.JWT_AUTHORIZATION_SECRET);
		} catch (error) {
			return next(new AppError(httpStatusCodes.UN_AUTHORIZED, 'unauthorized access'));
		}

		const tokenUser = await user.findFirst({
			where: { id: decodedToken.id, verified: true, active: true },
			select: {
				id: true,
				email: true,
				role: true,
				isPaid: true,
				planExpiry: true,
				name: true
			}
		});

		if (!tokenUser) {
			next(new AppError(httpStatusCodes.NOT_FOUND, 'something went wrong'));
		}

		if (!restrictTo.includes(tokenUser.role)) {
			return next(new AppError(httpStatusCodes.UN_AUTHORIZED, 'A unauthorized access'));
		}

		req.user = tokenUser;
		next();
	});
