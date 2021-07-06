const fs = require('fs');
const path = require('path');
const logger = require('../config/logger');

const baseToPng = async (base64Image, filename) => {
	fs.writeFileSync(
		path.join(__dirname, 'public', 'uploads', filename),
		base64Image,
		{ encoding: 'base64' },
		(err) => logger.error(err)
	);
};

module.exports = baseToPng;
