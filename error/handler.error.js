const { Prisma } = require('@prisma/client');
const {
	prismaClientKnownRequestErrorHandler,
	prismaClientInternalErrorHandler
} = require('./prismaErrorHandlers');
const logger = require('../config/logger');

function sendProductionError(err, req, res) {
	if (err.isOperational) {
		return res.status(err.statusCode).json({
			errors: [
				{
					msg: err.message,
					status: err.status
				}
			]
		});
	}

	logger.error({ err, stack: err.stack });
	return res.status(500).json({
		errors: [
			{
				msg: 'Something went wrong!',
				status: err.status
			}
		]
	});
}

module.exports = (err, req, res, next) => {
	let error;
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';

	if (
		err instanceof Prisma.PrismaClientInitializationError ||
		err instanceof Prisma.PrismaClientRustPanicError ||
		err instanceof Prisma.PrismaClientUnknownRequestError
	) {
		return prismaClientInternalErrorHandler(err, res);
	}

	if (err instanceof Prisma.PrismaClientKnownRequestError)
		return prismaClientKnownRequestErrorHandler(err, res);

	return sendProductionError(error || err, req, res);
};
