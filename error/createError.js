class AppError extends Error {
	constructor(statusCode, description) {
		super(description);

		Object.setPrototypeOf(this, new.target.prototype);
		this.statusCode = statusCode;
		this.status = `${statusCode}`.startsWith(4) ? 'fail' : 'error';
		this.isOperational = true;
		Error.captureStackTrace(this, this.constructor);
	}
}

exports.AppError = AppError;

exports.httpStatusCodes = {
	OK: 200,

	// CLIENT ERRORS
	BAD_REQUEST: 400,
	UN_AUTHORIZED: 401,
	FORBIDDEN: 403,
	PAYLOAD_TOO_LARGE: 413,
	TOO_MANY_REQUEST: 429,
	NOT_FOUND: 404,

	// SERVER ERRORS
	INTERNAL_SERVER: 500,
	NOT_IMPLEMENTED: 501,
	SERVICE_UNAVAILABLE: 503
};
