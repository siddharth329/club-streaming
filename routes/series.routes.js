const express = require('express');
const { episodeExistsFromParamId } = require('../utils/index');
const {
	getAllSeries,
	getSeries,
	createSeries,
	updateSeries,
	deleteSeries,
	validate
} = require('../controllers/series.controller');
const { protected } = require('../utils/index');

const router = express.Router();

// OPEN TO ALL ROUTER
router.get('/', validate('getAllSeries'), getAllSeries);
router.get('/:id', episodeExistsFromParamId, validate('getSeries'), getSeries);

// ADMIN ROUTES TO BE SECURED
router.use(protected([ 'ADMIN' ]));
router.post('/', validate('createSeries'), createSeries);
router.patch('/:id', episodeExistsFromParamId, validate('updateEpisode'), updateSeries);
router.delete('/:id', episodeExistsFromParamId, deleteSeries);

module.exports = router;
