const crypto = require('crypto');
const asyncHandler = require('express-async-handler');
const createError = require('http-errors');
const { PrismaClient } = require('@prisma/client');
const { query, param, validationResult, body } = require('express-validator/check');
const baseToPng = require('../services/baseToPng');
const deleteFile = require('../services/deleteFile');

const { episode, tag, model } = new PrismaClient();

const { orderByGenerator, fieldPurifier } = require('../utils/index');
const path = require('path');

const RESULTS_PER_PAGE = 15;

exports.validate = (method) => {
	switch (method) {
		case 'getAllEpisodes': {
			return [
				query('sortBy', 'invalid sort category')
					.optional()
					.isIn([ 'latest', 'favorite', 'views' ]),
				query('order', 'invalid order found').optional().isIn([ 'asc', 'desc' ]),
				query('page', 'invalid page value').optional().isNumeric()
			];
		}

		case 'getEpisode': {
			return [
				param('id', 'id should be a numeric value').isNumeric(),
				query('recommended').optional().isBoolean()
			];
		}

		case 'createEpisode': {
			return [
				body('title', 'episode must have a title')
					.not()
					.isEmpty()
					.trim()
					.escape()
					.isString(),
				body('info', 'episode must have a info').not().isEmpty().trim().isString(),
				body('thumbnail', 'episode must have a thumbnail').notEmpty().isBase64(),
				body('duration', 'episode must have a duration').isNumeric(),
				body('models', 'episode must have a model(s)').isArray(),
				body('tags', 'invalid tags').optional().isArray(),
				body('published', 'invalid published value').optional().isBoolean()
			];
		}

		case 'updateEpisode': {
			return [
				body('title', 'episode must have a title')
					.optional()
					.not()
					.isEmpty()
					.trim()
					.escape(),
				body('info', 'episode must have a info').optional().not().isEmpty().trim(),
				body('thumbnail', 'episode must have a thumbnail').optional().notEmpty().isBase64(),
				body('duration', 'episode must have a duration')
					.optional()
					.isNumeric()
					.not()
					.isEmpty(),
				body('models', 'invalid models value').optional().isArray().contains().isInt(),
				body('tags', 'invalid tags').optional().isArray().contains().isInt(),
				body('published', 'invalid published value').optional().isBoolean(),
				body('video_id', 'invalid video id').optional().isString()
			];
		}
	}
};

//-------------------------------------------------------------
// ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
//-------------------------------------------------------------

/**
* @api {get} /api/episode Get episodes
* @apiName Get all episodes
* @apiPermission user, admin
* @apiGroup User
*
* @apiParam  {String}? [sortBy] Sort By category available
* @apiParam  {String}? [order] Order of sort
* @apiParam  {Int}? [page] Page number of the result to return
*
* @apiSuccess (200) {Object} mixed `Episode` object
*/

exports.getAllEpisodes = asyncHandler(async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(422).json({ errors: errors.array({ onlyFirstError: true }) });
		return;
	}

	const data = await episode.findMany({
		orderBy: orderByGenerator(req.query.sortBy, req.query.order || 'desc'),
		where: { published: true },
		include: { tags: true, models: true },
		skip: (req.query.page - 1) * RESULTS_PER_PAGE || 0,
		take: RESULTS_PER_PAGE
	});

	res.status(200).json(data);
});

//-------------------------------------------------------------
// ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
//-------------------------------------------------------------
/**
* @api {get} /api/episode/:id Get episode
* @apiName Get episode by ID
* @apiPermission user, admin
* @apiGroup User
*
* @apiSuccess (200) {Object} mixed `Episode` object
*/
exports.getEpisode = asyncHandler(async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(422).json({ errors: errors.array({ onlyFirstError: true }) });
		return;
	}

	const { id } = req.params;
	const { recommended } = req.query;

	const data = await episode.findFirst({
		where: { id: parseInt(id), published: true },
		include: { models: true, tags: true }
	});

	if (!data) {
		return next(createError(404, 'requested video was not found'));
	}

	let recommendedEpisodes;
	if (recommended === 'true') {
		recommendedEpisodes = await episode.findMany({
			orderBy: { favCount: 'desc' },
			where: { published: true, NOT: [ { id: parseInt(id) } ] },
			include: { models: { select: { id: true, name: true } } },
			take: 10
		});
	}

	res.status(200).json({ episode: data, recommended: recommendedEpisodes });
});

//-------------------------------------------------------------
// ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
//-------------------------------------------------------------

/**
* @api {post} /api/episode Post episode
* @apiName Create episode
* @apiPermission admin
* @apiGroup User 
*
* @apiBody  {String} [title] Title of the episode
* @apiBody  {String} [info] Info about the episode
* @apiBody  {String} [thumbnail] Thumbnail link relative to the main URL
* @apiBody  {Int} [duration] Duration of episode in seconds
* @apiBody  {Array[Int]} [models] ID of models in the episode
* @apiBody  {Array[Int]} [tags] ID of tags in the episode
* @apiBody  {Boolean} [published] Video published or not
*
* @apiSuccess (201) {Object} mixed `Episode` object
*/

exports.createEpisode = asyncHandler(async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(422).json({ errors: errors.array({ onlyFirstError: true }) });
		return;
	}

	let { title, info, thumbnail, preview, duration, models, tags, published, video_id } = req.body;

	const filename = `${crypto.randomBytes(18).toString('hex')}.png`;
	baseToPng(thumbnail, filename, { width: 480, height: 270 });

	const newEpisode = await episode.create({
		data: {
			title,
			info,
			thumbnail: filename,
			preview,
			duration,
			video_id,
			models: { connect: await fieldPurifier(model, models) },
			tags: { connect: await fieldPurifier(tag, tags) },
			published: published ? published : false,
			...(published && { publishedAt: new Date(Date.now()) })
		},
		include: {
			tags: true,
			models: true
		}
	});

	res.status(201).json(newEpisode);
});

//-------------------------------------------------------------
// ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
//-------------------------------------------------------------

/**
* @api {patch} /api/episode/:id Patch existing episode
* @apiName Update episode
* @apiPermission admin
* @apiGroup User
*
* @apiParam {Int} [id] Id of the episode to update
*
* @apiBody  {String}? [title] Title of the episode
* @apiBody  {String}? [info] Info about the episode
* @apiBody  {String}? [thumbnail] Thumbnail link relative to the main URL
* @apiBody  {Int}? [duration] Duration of episode in seconds
* @apiBody  {Array[Int]}? [models] ID of models in the episode
* @apiBody  {Array[Int]}? [tags] ID of tags in the episode
* @apiBody  {Boolean}? [published] Video published or not
*
* @apiSuccess (200) {Object} mixed `Episode` object
*/

exports.updateEpisode = asyncHandler(async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(422).json({ errors: errors.array({ onlyFirstError: true }) });
		return;
	}

	const { id } = req.params;
	let data = req.body;
	if (data.models) data.models = { connect: await fieldPurifier(model, models) };
	if (data.tags) data.models = { connect: await fieldPurifier(tag, tags) };

	const filename = `${crypto.randomBytes(18).toString('hex')}.png`;
	if (data.thumbnail) {
		const episodeData = await episode.findFirst({
			where: { id: parseInt(id) },
			select: { thumbnail: true }
		});
		deleteFile(path.join(__dirname, '..', 'public', 'uploads', episodeData.thumbnail));
		baseToPng(data.thumbnail, filename, { width: 480, height: 270 });
	}

	const updatedEpisode = await episode.update({
		data: {
			...data,
			...(data.published && !data.publishedAt && { publishedAt: new Date(Date.now()) }),
			...(data.thumbnail && { thumbnail: filename })
		},
		where: { id: parseInt(id) },
		include: {
			models: true,
			tags: true
		}
	});

	res.status(200).json(updatedEpisode);
});

//-------------------------------------------------------------
// ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
//-------------------------------------------------------------

/**
* @api {delete} /api/episode/:id Permanently delete existing episode
* @apiName Delete episode
* @apiPermission admin
* @apiGroup User
*
* @apiParam {Int} [id] Id of the episode to delete
*
* @apiSuccess (204) {Object} No Content Header
*/

exports.deleteEpisode = asyncHandler(async (req, res, next) => {
	let { id } = req.params;
	id = parseInt(id);

	const episodeData = await episode.findFirst({ where: { id }, select: { thumbnail: true } });
	const deletedEpisode = await episode.delete({ where: { id } });
	deleteFile(path.join(__dirname, '..', 'public', 'uploads', episodeData.thumbnail));

	res.status(204).json(deletedEpisode);
});
