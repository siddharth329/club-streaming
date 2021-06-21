const express = require('express');
const {
	getAllModels,
	getModel,
	deleteModel,
	validate,
	createModel,
	updateModel
} = require('../controllers/model.controller');
const { modelExistsFromParamId, protected } = require('../utils/index');
const router = express.Router();

// OPEN TO ALL
router.get('/', getAllModels);
router.get('/:id', modelExistsFromParamId, getModel);

// ADMIN PROTECTED ROUTE
router.use(protected([ 'ADMIN' ]));
router.post('/', validate('createModel'), createModel);
router.patch('/:id', modelExistsFromParamId, validate('updateModel'), updateModel);
router.delete('/:id', modelExistsFromParamId, deleteModel);

module.exports = router;
