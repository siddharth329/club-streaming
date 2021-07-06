const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const logger = require('../config/logger');

const baseToPng = async (base64Image, filename, { height, width }) => {
	const buffer = new Buffer.from(base64Image, 'base64');
	sharp(buffer)
		.resize(width, height, { fit: 'cover' })
		.toBuffer()
		.then((data) => {
			fs.writeFileSync(
				path.join(__dirname, '..', 'public', 'uploads', filename),
				data,
				{ encoding: 'base64' },
				(err) => logger.error(err)
			);
		})
		.catch((err) => logger.error(err));
};

module.exports = baseToPng;
