const asyncHandler = require('express-async-handler');
const createError = require('http-errors');
const { PrismaClient } = require('@prisma/client');
const { favorite, episode } = new PrismaClient();

exports.favoriteVideoPositive = asyncHandler(async (req, res, next) => {
	const { id: userId } = req.user;
	const { id: episodeId } = req.params;

	const likeExists = await favorite.findUnique({
		where: {
			user_id: userId,
			episode_id: episodeId
		}
	});

	if (likeExists) {
		return next(createError(403, `already voted for episode with id: ${episodeId}`));
	}

	await favorite.create({
		data: {
			episode_id: episodeId,
			user_id: userId
		}
	});

	await episode.update({
		data: {
			favCount: {
				increment: 1
			}
		}
	});

	res.status(200).json({ msg: 'you liked the video' });
});

exports.favoriteVideoNegative = asyncHandler(async (req, res, next) => {
	const { id: userId } = req.user;
	const { id: episodeId } = req.params;

	const likeExists = await favorite.findUnique({
		where: {
			user_id: userId,
			episode_id: episodeId
		}
	});

	if (!likeExists) {
		return next(createError(403, `something went wrong`));
	}

	await favorite.delete({
		data: {
			episode_id: episodeId,
			user_id: userId
		}
	});

	await episode.update({
		data: {
			favCount: {
				decrement: 1
			}
		}
	});

	res.status(200).json({ msg: 'you unliked the video' });
});
