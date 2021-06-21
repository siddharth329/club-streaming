const asyncHandler = require('express-async-handler');
const createError = require('http-errors');
const { query, param, validationResult, body } = require('express-validator/check');
const { PrismaClient } = require('@prisma/client');
const { episode, tag, model } = new PrismaClient();

const { orderByGenerator } = require('../utils/index');

// latest, favorites, views

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
			return [ param('id', 'id should be a numeric value').isNumeric() ];
		}

		case 'createEpisode': {
			return [
				body('title', 'episode must have a title').not().isEmpty().trim().escape(),
				body('info', 'episode must have a info').not().isEmpty().trim(),
				body('thumbnail', 'episode must have a thumbnail').not().isEmpty().trim(),
				body('duration', 'episode must have a duration').isNumeric(),
				body('models', 'episode must have a model(s)').isArray(),
				body('tags', 'invalid tags').optional().isArray()
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
				body('thumbnail', 'episode must have a thumbnail')
					.optional()
					.not()
					.isEmpty()
					.trim(),
				body('duration', 'episode must have a duration')
					.optional()
					.isNumeric()
					.not()
					.isEmpty(),
				body('models', 'invalid models value').optional().isArray().contains().isInt(),
				body('tags', 'invalid tags').optional().isArray().contains().isInt(),
				body('published', 'invalid published value').optional().isBoolean(),
				body('series_id', 'invalid series id').optional().isInt()
			];
		}
	}
};

//-------------------------------------------------------------
// ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
//-------------------------------------------------------------
/**
* @api {post} /api/episode Get episodes
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
		where: { published: false },
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
* @api {post} /api/episode Get episode
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
	const data = await episode.findFirst({
		where: { id: parseInt(id) },
		include: { models: true, tags: true }
	});

	if (!data) {
		return next(createError(404, 'requested video was not found'));
	}

	res.status(200).json(data);
});

//-------------------------------------------------------------
// ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
//-------------------------------------------------------------

exports.createEpisode = asyncHandler(async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(422).json({ errors: errors.array({ onlyFirstError: true }) });
		return;
	}

	let { title, info, thumbnail, preview, duration, models, tags } = req.body;

	const fieldPurifier = (model, field) => {
		return model.findMany({
			where: { OR: [ ...field.map((f) => ({ id: f })) ] },
			select: { id: true }
		});
	};

	const newEpisode = await episode.create({
		data: {
			title,
			info,
			thumbnail,
			preview,
			duration,
			models: { connect: await fieldPurifier(model, models) },
			tags: { connect: await fieldPurifier(tag, tags) }
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

	const updatedEpisode = await episode.update({
		data,
		where: { id },
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

exports.deleteEpisode = asyncHandler(async (req, res, next) => {
	let { id } = req.params;
	id = parseInt(id);

	const deletedEpisode = await episode.delete({
		where: { id },
		include: { models: true, tags: true }
	});
	//TODO: Deleting all favorites relation when episode gets deleted

	res.status(204).json(deletedEpisode);
});
