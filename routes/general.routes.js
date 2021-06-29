const express = require('express');
const {
	getHomePageContent,
	validate,
	searchTypeahead
} = require('../controllers/general.controller');
const router = express();

router.get('/home', getHomePageContent);
router.get('/search', validate('searchTypeahead'), searchTypeahead);

module.exports = router;
