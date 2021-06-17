const asyncHandler = require('express-async-handler');
const createError = require('http-errors');
const { query, param, validationResult, body } = require('express-validator/check');
const { PrismaClient } = require('@prisma/client');
const { model } = new PrismaClient();

const RESULTS_PER_PAGE = 12;

//-------------------------------------------------------------
// ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
//-------------------------------------------------------------
/**
* @api {post} /api/episode Get models
* @apiName Get all models
* @apiPermission user, admin
* @apiGroup User
*
* @apiParam  {Int}? [page] Page number of the result to return
*
* @apiSuccess (200) {Object} mixed `Episode` object
*/
exports.getAllModels = asyncHandler(async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(422).json({ errors: errors.array() });
		return;
	}

	const data = await model.findMany({
		skip: (req.query.page - 1) * RESULTS_PER_PAGE || 0,
		take: RESULTS_PER_PAGE
	});

	res.status(200).json(data);
});

//-------------------------------------------------------------
// ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
//-------------------------------------------------------------
/**
* @api {post} /api/model Get model
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
		res.status(422).json({ errors: errors.array() });
		return;
	}

	const { id } = req.params;
	const data = await model.findFirst({
		where: { id },
		include: {
			episodes: {
				skip: (req.params.page - 1) * RESULTS_PER_PAGE,
				take: RESULTS_PER_PAGE
			}
		}
	});

	if (!data) {
		return next(createError(404, 'requested model was not found'));
	}

	res.status(200).json(data);
});
