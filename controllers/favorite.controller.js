const asyncHandler = require('express-async-handler');
const createError = require('http-errors');
const { PrismaClient } = require('@prisma/client');
const { param, validationResult } = require('express-validator/check');
const { favorite, episode } = new PrismaClient();

exports.validate = () => [ param('id', 'invald parameter id').isInt() ];

exports.favoriteVideoPositive = asyncHandler(async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(422).json({ errors: errors.array({ onlyFirstError: true }) });
		return;
	}

	const { id: userId } = req.user;
	const { id: episodeId } = req.params;

	const likeExists = await favorite.findFirst({
		where: {
			user_id: userId,
			episode_id: parseInt(episodeId)
		}
	});

	if (likeExists) {
		return next(createError(403, `already voted for episode with id: ${episodeId}`));
	}

	await favorite.create({
		data: {
			episode_id: parseInt(episodeId),
			user_id: userId
		}
	});

	await episode.update({
		where: { id: parseInt(episodeId) },
		data: {
			favCount: {
				increment: 1
			}
		}
	});

	res.status(200).json({ msg: 'you liked the video' });
});

exports.favoriteVideoNegative = asyncHandler(async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(422).json({ errors: errors.array({ onlyFirstError: true }) });
		return;
	}

	const { id: userId } = req.user;
	const { id: episodeId } = req.params;

	const likeExists = await favorite.findFirst({
		where: {
			user_id: userId,
			episode_id: parseInt(episodeId)
		}
	});

	if (!likeExists) {
		return next(createError(403, `something went wrong`));
	}

	await favorite.delete({
		where: {
			id: likeExists.id
		}
	});

	await episode.update({
		where: { id: parseInt(episodeId) },
		data: {
			favCount: {
				decrement: 1
			}
		}
	});

	res.status(200).json({ msg: 'you unliked the video' });
});
