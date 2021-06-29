const asyncHandler = require('express-async-handler');
const createError = require('http-errors');
const { query, param, validationResult, body } = require('express-validator/check');
const { PrismaClient } = require('@prisma/client');
const { episode, model } = new PrismaClient();

exports.validate = (method) => {
	switch (method) {
		case 'searchTypeahead': {
			return [ query('q', 'invalid query parameter q').isString().isLength({ min: 2 }) ];
		}
	}
};

exports.getHomePageContent = asyncHandler(async (req, res, next) => {
	const latestEpisodes = await episode.findMany({
		orderBy: { createdAt: 'desc' },
		include: { models: true, tags: true },
		take: 3
	});

	const mostLikedEpisodes = await episode.findMany({
		orderBy: { favCount: 'desc' },
		include: { models: true, tags: true },
		take: 3
	});

	const latestModels = await model.findMany({
		orderBy: { createdAt: 'desc' },
		take: 5
	});

	return res.status(200).json({
		latestEpisodes,
		mostLikedEpisodes,
		latestModels
	});
});

exports.searchTypeahead = asyncHandler(async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(422).json({ errors: errors.array({ onlyFirstError: true }) });
		return;
	}

	const { q } = req.query;

	const results = {
		episodes: await episode.findMany({
			where: { OR: [ { title: { contains: q }, info: { contains: q } } ] },
			select: { id: true, title: true, thumbnail: true },
			take: 5
		}),
		models: await model.findMany({
			where: { name: { contains: q } },
			select: { id: true, name: true, thumbnail: true },
			take: 2
		})
	};

	res.status(200).json(results);
});
