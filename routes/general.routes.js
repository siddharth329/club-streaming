const express = require('express');
const {
	getHomePageContent,
	validate,
	searchTypeahead,
	requestBanner
} = require('../controllers/general.controller');
const router = express();

router.get('/home', getHomePageContent);
router.get('/search', validate('searchTypeahead'), searchTypeahead);
router.get('/banner/:type', validate('requestBanner'), requestBanner);

router.get('/temp', (req, res, next) => {
	console.log(req.query);
	res.send('ok');
});

module.exports = router;
