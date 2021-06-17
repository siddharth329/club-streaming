const express = require('express');
const { getAllModels, getModel } = require('../controllers/model.controller');
const router = express.Router();

// OPEN TO ALL
router.get('/', getAllModels);
router.get('/:id', getModel);

// ADMIN PROTECTED ROUTE

module.exports = router;
