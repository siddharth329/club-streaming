const express = require('express');
const { validate, generateEpisodeWatchLink } = require('../controllers/stream.controller');
const { protected } = require('../utils/index');
const router = express.Router();

router.use(protected([ 'ADMIN', 'PREMIUM' ]));

router.get('/:id', validate('generateEpisodeWatchLink'), generateEpisodeWatchLink);

module.exports = router;
