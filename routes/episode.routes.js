const express = require('express');
const { episodeExistsFromParamId } = require('../utils/index');
const {
	getAllEpisodes,
	getEpisode,
	validate,
	createEpisode,
	deleteEpisode,
	updateEpisode
} = require('../controllers/episode.controller');

const router = express.Router();

// OPEN TO ALL ROUTER
router.get('/', validate('getAllEpisodes'), getAllEpisodes);
router.get('/:id', episodeExistsFromParamId, validate('getEpisode'), getEpisode);

// ADMIN ROUTES TO BE SECURED
router.post('/', validate('createEpisode'), createEpisode);
router.patch('/:id', episodeExistsFromParamId, validate('updateEpisode'), updateEpisode);
router.delete('/:id', episodeExistsFromParamId, deleteEpisode);

module.exports = router;
