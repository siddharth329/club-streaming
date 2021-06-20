const express = require('express');
const router = express.Router();
const {
	favoriteVideoPositive,
	favoriteVideoNegative
} = require('../controllers/favorite.controller');
const { episodeExistsFromParamId } = require('../utils');

// ALL THE ROUTES BELOW ARE USER PROTECTED
router.get('/like/:id', episodeExistsFromParamId, favoriteVideoPositive);
router.get('/dislike/:id', episodeExistsFromParamId, favoriteVideoNegative);

module.exports = router;
