exports.prismaClientInternalErrorHandler = (err, res) => {
	return res.status(500).json({ errors: [ { msg: 'Internal Server Error' } ] });
};

exports.prismaClientKnownRequestErrorHandler = (err, res) => {
	const errors = [];

	if (err.code === 'P2002') {
		errors.push({
			msg: 'validation failed for unique property',
			value: err.meta.target,
			location: 'body'
		});
	}

	return res.status(400).json({ errors });
};
