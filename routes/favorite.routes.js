const express = require('express');
const router = express.Router();
const {
	favoriteVideoPositive,
	favoriteVideoNegative,
	validate
} = require('../controllers/favorite.controller');
const { episodeExistsFromParamId, protected } = require('../utils/index');

// ALL THE ROUTES BELOW ARE USER PROTECTED
router.use(protected([ 'ADMIN', 'PREMIUM' ]));
router.get('/like/:id', episodeExistsFromParamId, validate(), favoriteVideoPositive);
router.get('/dislike/:id', episodeExistsFromParamId, validate(), favoriteVideoNegative);

module.exports = router;
