const logger = require('../config/logger');

function sendProductionError(err, req, res) {
	if (err.isOperational) {
		return res.status(err.statusCode).json({
			status: err.status,
			message: err.message
		});
	}

	logger.error(err);
	return res.status(500).json({
		status: 'error',
		message: 'Something went wrong!'
	});
}

module.exports = (err, req, res, next) => {
	let error;
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';

	return sendProductionError(error || err, req, res);
};
