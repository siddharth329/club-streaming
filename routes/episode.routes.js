const express = require('express');
const { seriesExistsFromParamId } = require('../utils/index');
const {
	getAllEpisodes,
	getEpisode,
	validate,
	createEpisode,
	deleteEpisode,
	updateEpisode
} = require('../controllers/episode.controller');
const { protected } = require('../utils/index');

const router = express.Router();

// OPEN TO ALL ROUTER
router.get('/', validate('getAllEpisodes'), getAllEpisodes);
router.get('/:id', seriesExistsFromParamId, validate('getEpisode'), getEpisode);

// ADMIN ROUTES TO BE SECURED
router.use(protected([ 'ADMIN' ]));
router.post('/', validate('createEpisode'), createEpisode);
router.patch('/:id', seriesExistsFromParamId, validate('updateEpisode'), updateEpisode);
router.delete('/:id', seriesExistsFromParamId, deleteEpisode);

module.exports = router;
