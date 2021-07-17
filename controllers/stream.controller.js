const axios = require('axios');
const asyncHandler = require('express-async-handler');
const { AppError, httpStatusCodes } = require('../error/createError');
const { param, validationResult } = require('express-validator/check');
const { PrismaClient } = require('@prisma/client');
const genSignedUrl = require('../utils/genSignedUrl');
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
		where: { id: parseInt(id), published: true },
		select: { video_id: true, duration: true }
	});

	if (!data || (req.user.role !== 'ADMIN' && !data.published)) {
		return next(new AppError(httpStatusCodes.NOT_FOUND, 'video not found'));
	}

	const { data: { query } } = await axios.get('http://ip-api.com/json');
	const signedUrl = genSignedUrl({
		filePath: data.video_id,
		ip: query,
		expiryTimestamp: Math.floor(Date.now() / 1000 + 2 * data.duration)
	});

	await episode.update({
		where: { id: parseInt(id) },
		data: { views: { increment: 1 } }
	});

	res.status(200).json({ signedUrl });
});
