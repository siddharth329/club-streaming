const asyncHandler = require('express-async-handler');
const createError = require('http-errors');
const { query, param, validationResult, body } = require('express-validator/check');
const { PrismaClient } = require('@prisma/client');
const { model } = new PrismaClient();

const RESULTS_PER_PAGE = 12;

exports.validate = (method) => {
	switch (method) {
		case 'getAllModels': {
			return [
				query('page', 'invalid page value').optional().isNumeric(),
				query('sex', 'invalid sex type found')
					.optional()
					.isString()
					.isIn([ 'MALE', 'FEMALE' ])
			];
		}

		case 'getModel': {
			return [ param('id', 'id should be a numeric value').isInt() ];
		}

		case 'createModel': {
			return [
				body('firstName', 'model must have a firstName').notEmpty().trim().escape(),
				body('lastName', 'model must have a lastName').notEmpty().trim().escape(),
				body('thumbnail', 'model must have a thumbnail').notEmpty().trim(),
				body('sex', 'model must have a valid sex').notEmpty().isIn([ 'MALE', 'FEMALE' ])
			];
		}

		case 'updateModel': {
			return [
				body('firstName', 'something wrong with model firstName')
					.optional()
					.not()
					.isEmpty()
					.trim()
					.escape(),
				body('lastName', 'something wrong with model lastName')
					.optional()
					.not()
					.isEmpty()
					.trim()
					.escape(),
				body('thumbnail', 'episode must have a thumbnail')
					.optional()
					.not()
					.isEmpty()
					.trim(),
				body('sex', 'model must have a valid sex').optional().isIn([ 'MALE', 'FEMALE' ])
			];
		}
	}
};

//-------------------------------------------------------------
// ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
//-------------------------------------------------------------

/**
* @api {get} /api/model Get models
* @apiName Get all models
* @apiPermission user, admin
* @apiGroup User
*
* @apiParam  {Int}? [page] Page number of the result to return
* @apiParam  {String}? [sex] Gender of models from [MALE, FEMALE]
*
* @apiSuccess (200) {Object} mixed `Model` object
*/
exports.getAllModels = asyncHandler(async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(422).json({ errors: errors.array({ onlyFirstError: true }) });
		return;
	}

	const data = await model.findMany({
		...(req.query.sex && { where: { sex: req.query.sex } }),
		skip: (req.query.page - 1) * RESULTS_PER_PAGE || 0,
		take: RESULTS_PER_PAGE
	});

	res.status(200).json(data);
});

//-------------------------------------------------------------
// ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
//-------------------------------------------------------------
/**
* @api {get} /api/model Get model
* @apiName Get model by ID
* @apiPermission user, admin
* @apiGroup User
*
* @apiParam  {Int}? [page] Page number of the result to return
*
* @apiSuccess (200) {Object} mixed `Model` object
*/
exports.getModel = asyncHandler(async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(422).json({ errors: errors.array({ onlyFirstError: true }) });
		return;
	}

	const { id } = req.params;
	const data = await model.findFirst({
		where: { id: parseInt(id) },
		include: {
			episodes: {
				where: { published: true },
				skip: (parseInt(req.query.page) - 1) * RESULTS_PER_PAGE || 0,
				take: RESULTS_PER_PAGE
			}
		}
	});

	if (!data) {
		return next(createError(404, 'requested model was not found'));
	}

	res.status(200).json(data);
});

//-------------------------------------------------------------
// ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
//-------------------------------------------------------------

/**
* @api {post} /api/model Post models
* @apiName Create Model
* @apiPermission admin
* @apiGroup User
*
* @apiBody  {String} [firstName] First Name of the model
* @apiBody  {String} [lastName] Last Name of the model
* @apiBody  {String} [info] Info about the model
* @apiBody  {String} [thumbnail] Relative url to the thumbnail of model
* @apiBody  {String} [sex] Gender of model from [MALE, FEMALE]
*
* @apiSuccess (201) {Object} mixed `Model` object
*/

exports.createModel = asyncHandler(async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(422).json({ errors: errors.array({ onlyFirstError: true }) });
		return;
	}

	let { firstName, lastName, info, thumbnail } = req.body;

	const newModel = await model.create({
		data: {
			firstName,
			lastName,
			info,
			thumbnail
		}
	});

	res.status(201).json(newModel);
});

//-------------------------------------------------------------
// ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
//-------------------------------------------------------------

/**
* @api {patch} /api/model/:id Patch models
* @apiName Update existing model by ID
* @apiPermission admin
* @apiGroup User
*
* @apiParam {Int} [id] ID of the model to update
*
* @apiBody  {String}? [firstName] First Name of the model
* @apiBody  {String}? [lastName] Last Name of the model
* @apiBody  {String}? [info] Info about the model
* @apiBody  {String}? [thumbnail] Relative url to the thumbnail of model
* @apiBody  {String}? [sex] Gender of model from [MALE, FEMALE]
*
* @apiSuccess (200) {Object} mixed `Model` object
*/

exports.updateModel = asyncHandler(async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(422).json({ errors: errors.array({ onlyFirstError: true }) });
		return;
	}

	const { id } = req.params;
	let data = req.body;

	const updatedModel = await model.update({
		data,
		where: { id: parseInt(id) }
	});

	res.status(200).json(updatedModel);
});

//-------------------------------------------------------------
// ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
//-------------------------------------------------------------

/**
* @api {post} /api/model Post models
* @apiName Create Model
* @apiPermission admin
* @apiGroup User
*
* @apiParam {Int} [id] ID to model to permanantly delete from DB
*
* @apiSuccess (204) {Object} No Content Header
*/

exports.deleteModel = asyncHandler(async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(422).json({ errors: errors.array({ onlyFirstError: true }) });
		return;
	}

	let { id } = req.params;
	id = parseInt(id);

	const allEpisodesId = await model.findFirst({
		where: { id },
		select: { episodes: { select: { id: true } } }
	});
	if (allEpisodesId.episodes.length) {
		return next(createError(412, 'there are episodes which cannot exists without a model'));
	}

	const deletedModel = await model.delete({
		where: { id },
		include: { models: true, tags: true }
	});

	res.status(204).json(deletedModel);
});
