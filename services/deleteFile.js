const fs = require('fs');
const logger = require('../config/logger');

const deleteFile = (filePath) => {
	fs.unlink(filePath, (err) => err && logger.error(err));
};

module.exports = deleteFile;