const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const logger = require('../config/logger');

const resizeThumbnail = async (base64Image, { height, width }) => {
	const buffer = Buffer.from(base64Image, 'base64');
	const image = await sharp(buffer).resize(width, height, { fit: 'cover' }).toBuffer();
	return image;
};

module.exports = resizeThumbnail;
