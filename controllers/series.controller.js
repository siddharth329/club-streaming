const asyncHandler = require('express-async-handler');
const createError = require('http-errors');
const { query, param, validationResult, body } = require('express-validator/check');
const { PrismaClient } = require('@prisma/client');
const { series, episode } = new PrismaClient();

const { orderByGenerator, fieldPurifier } = require('../utils/index');

exports.validate = (method) => {
	switch (method) {
		case 'getAllSeries': {
			return [
				query('sortBy', 'invalid sort category').optional().isIn([ 'latest' ]),
				query('order', 'invalid order found').optional().isIn([ 'asc', 'desc' ]),
				query('page', 'invalid page value').optional().isNumeric()
			];
		}

		case 'getSeries': {
			return [ param('id', 'id should be a numeric value').isNumeric() ];
		}

		case 'createSeries': {
			return [
				body('name', 'invalid name parameter').notEmpty().trim().escape().isString(),
				body('info', 'invalid info parameter').notEmpty().trim().escape().isString(),
				body('thumbnail', 'series must have a thumbnail').not().isEmpty().trim(),
				body('episodes', 'invalid episodes').optional()
			];
		}
	}
};

//-------------------------------------------------------------
// ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
//-------------------------------------------------------------

/**
* @api {get} /api/series Get series
* @apiName Get all series
* @apiPermission user, admin
* @apiGroup User
*
* @apiParam  {String}? [sortBy] Sort By category available
* @apiParam  {String}? [order] Order of sort
* @apiParam  {Int}? [page] Page number of the result to return
*
* @apiSuccess (200) {Object} mixed `Series` object
*/

exports.getAllSeries = asyncHandler(async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(422).json({ errors: errors.array({ onlyFirstError: true }) });
		return;
	}

	const data = await series.findMany({
		where: { episodes: { some: { published: true } } },
		orderBy: orderByGenerator(req.query.sortBy, req.query.order || 'desc'),
		include: {
			episodes: { where: { published: true }, include: { models: true, tags: true } }
		},
		skip: (req.query.page - 1) * RESULTS_PER_PAGE || 0,
		take: RESULTS_PER_PAGE
	});

	res.status(200).json(data);
});

//-------------------------------------------------------------
// ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
//-------------------------------------------------------------

/**
* @api {get} /api/series/:id Get series
* @apiName Get series by ID
* @apiPermission user, admin
* @apiGroup User
*
* @apiSuccess (200) {Object} mixed `Series` object
*/
exports.getSeries = asyncHandler(async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(422).json({ errors: errors.array({ onlyFirstError: true }) });
		return;
	}

	const { id } = req.params;
	const data = await series.findFirst({
		where: { id: parseInt(id) },
		include: {
			episodes: {
				where: { published: true },
				include: { models: true, tags: true }
			}
		}
	});

	if (!data) {
		return next(createError(404, 'requested series was not found'));
	}

	res.status(200).json(data);
});

//-------------------------------------------------------------
// ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
//-------------------------------------------------------------

/**
* @api {post} /api/series Post series
* @apiName Create series
* @apiPermission admin
* @apiGroup User 
*
* @apiBody  {String} [name] Title of the series
* @apiBody  {String} [info] Info about the series
* @apiBody  {String} [thumbnail] Thumbnail link relative to the main URL
* @apiBody  {Array[Int]} [episodes] ID of models in the series
*
* @apiSuccess (201) {Object} mixed `Series` object
*/

exports.createSeries = asyncHandler(async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(422).json({ errors: errors.array({ onlyFirstError: true }) });
		return;
	}

	const { name, info, thumbnail, episodes } = req.body;

	const newSeries = await series.create({
		data: {
			name,
			info,
			thumbnail,
			...(episodes && { episodes: { connect: await fieldPurifier(episode, episodes) } })
		},
		include: {
			episodes: {
				where: { published: true },
				include: { models: true, tags: true }
			}
		}
	});

	res.status(201).json(newSeries);
});

//-------------------------------------------------------------
// ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
//-------------------------------------------------------------

/**
* @api {patch} /api/series/:id Patch existing series
* @apiName Update series
* @apiPermission admin
* @apiGroup User
*
* @apiParam {Int} [id] Id of the series to update
*
* @apiBody  {String}? [name] Title of the series
* @apiBody  {String}? [info] Info about the series
* @apiBody  {String}? [thumbnail] Thumbnail link relative to the main URL
* @apiBody  {Array[Int]}? [episodes] ID of models in the series
*
* @apiSuccess (200) {Object} mixed `Series` object
*/

exports.updateSeries = asyncHandler(async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(422).json({ errors: errors.array({ onlyFirstError: true }) });
		return;
	}

	const { id } = req.params;
	let data = req.body;
	if (data.episodes) data.episodes = { connect: await fieldPurifier(episode, episodes) };

	const updatedEpisode = await series.update({
		data,
		where: { id: parseInt(id) },
		include: {
			episodes: {
				where: { published: true },
				include: { models: true, tags: true }
			}
		}
	});

	res.status(200).json(updatedEpisode);
});

//-------------------------------------------------------------
// ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
//-------------------------------------------------------------
/**
* @api {delete} /api/series/:id Permanently delete existing series
* @apiName Delete series
* @apiPermission admin
* @apiGroup User
*
* @apiParam {Int} [id] Id of the series to delete
*
* @apiSuccess (204) {Object} No Content Header
*/

exports.deleteSeries = asyncHandler(async (req, res, next) => {
	let { id } = req.params;
	id = parseInt(id);

	// Removing the relation of episode from series
	await episode.updateMany({
		where: { series_id: id },
		data: { series_id: null }
	});

	const deletedSeries = await episode.delete({ where: { id } });

	res.status(204).json(deletedSeries);
});
