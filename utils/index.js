const createError = require('http-errors');
const asyncHandler = require('express-async-handler');
const { param, validationResult } = require('express-validator/check');
const { PrismaClient } = require('@prisma/client');

const { episode, model } = new PrismaClient();

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

exports.episodeExistsFromParamId = asyncHandler(async (req, res, next) => {
	param('id', 'invalid id').isInt();
	const errors = validationResult(req);
	console.log(errors);
	if (!errors.isEmpty()) {
		res.status(422).json({ errors: errors.array() });
		return;
	}

	const episodeExists = await episode.findUnique({
		where: { id: parseInt(req.params.id) }
	});

	if (!episodeExists) {
		return next(createError(404, 'requested episode was not found'));
	}

	next();
});

exports.modelExistsFromParamId = asyncHandler(async (req, res, next) => {
	param('id', 'invalid id').isInt();
	const errors = validationResult(req);
	console.log(errors);
	if (!errors.isEmpty()) {
		res.status(422).json({ errors: errors.array() });
		return;
	}

	const modelExists = await model.findUnique({
		where: { id: parseInt(req.params.id) }
	});

	if (!modelExists) {
		return next(createError(404, 'requested model was not found'));
	}

	next();
});
