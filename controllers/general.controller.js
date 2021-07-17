const asyncHandler = require('express-async-handler');
const { query, param, validationResult, body } = require('express-validator/check');
const { PrismaClient } = require('@prisma/client');
const { episode, model, banners } = new PrismaClient();

exports.validate = (method) => {
	switch (method) {
		case 'searchTypeahead': {
			return [ query('q', 'invalid query parameter q').isString().isLength({ min: 2 }) ];
		}

		case 'requestBanner': {
			return [ param('type').isString().isIn([ 'HOME_TOP_BANNER' ]) ];
		}
	}
};

exports.getHomePageContent = asyncHandler(async (req, res, next) => {
	const latestEpisodes = await episode.findMany({
		orderBy: { createdAt: 'desc' },
		include: { models: true, tags: true },
		take: 4
	});

	const mostLikedEpisodes = await episode.findMany({
		orderBy: { favCount: 'desc' },
		include: { models: true, tags: true },
		take: 4
	});

	const latestModels = await model.findMany({
		orderBy: { createdAt: 'desc' },
		take: 5
	});

	const mostWatchedEpisodes = await episode.findMany({
		orderBy: { views: 'desc' },
		include: { models: true, tags: true },
		take: 4
	});

	return res.status(200).json([
		{
			title: 'Latest Episodes',
			redirect: '/videos?sortBy=latest',
			type: 'EPISODE',
			data: latestEpisodes
		},
		{
			title: 'Top Trending Scenes',
			redirect: '/videos?sortBy=favorite',
			type: 'EPISODE',
			data: mostLikedEpisodes
		},
		{ title: 'Latest Models', redirect: '/models', type: 'MODEL', data: latestModels },
		{
			title: 'Most Watched Scenes',
			redirect: '/videos?sortBy=views',
			type: 'EPISODE',
			data: mostWatchedEpisodes
		}
	]);
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
			where: {
				OR: [ { title: { contains: q } }, { info: { contains: q } } ]
			},
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

exports.requestBanner = asyncHandler(async (req, res, next) => {
	const { type } = req.params;

	const data = await banners.findMany({
		where: { bannerType: type },
		select: { id: true, data: true, redirect: true }
	});

	res.status(200).json(data);
});
