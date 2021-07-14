const asyncHandler = require('express-async-handler');
const { AppError, httpStatusCodes } = require('../error/createError');
const jwt = require('jsonwebtoken');
const { param, validationResult } = require('express-validator/check');
const { PrismaClient } = require('@prisma/client');
const { episode } = new PrismaClient();

exports.validate = (method) => {
	switch (method) {
		case 'generateEpisodeWatchLink': {
			return [ param('id', 'invalid parameter id').notEmpty().isInt() ];
		}
	}
};

//-------------------------------------------------------------
// ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
//-------------------------------------------------------------

/**
* @api {get} /api/stream/:id Generate Link
* @apiName Get Episode Watch Link
* @apiPermission premium, admin
* @apiGroup User
*
* @apiParam  {Int} [id] ID of video to generate link
*
* @apiSuccess (200) {String} Generated stream URL
*/

exports.generateEpisodeWatchLink = asyncHandler(async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(422).json({ errors: errors.array({ onlyFirstError: true }) });
		return;
	}

	const { id } = req.params;

	const data = await episode.findFirst({
		where: { id: parseInt(id) },
		select: { video_id: true, published: true }
	});

	if (!data || (req.user.role !== 'ADMIN' && !data.published)) {
		return next(new AppError(httpStatusCodes.NOT_FOUND, 'video not found'));
	}

	const generatedStreamUrl = jwt.sign(
		{ ip: req.ip, fileId: data.video_id },
		process.env.VIDEO_LINK_GENERATOR_SECRET,
		{ expiresIn: process.env.VIDEO_LINK_VALIDITY_DURATION }
	);

	await episode.update({
		where: { id: parseInt(id) },
		data: { views: { increment: 1 } }
	});

	res.status(200).send(`${process.env.CDN_STREAM_URL}?token=${generatedStreamUrl}`);
});
