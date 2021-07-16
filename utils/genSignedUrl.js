const crypto = require('crypto');

const genSignedUrl = ({ filePath, ip, expiryTimestamp }) => {
	let hashStr = `${expiryTimestamp}${filePath}${ip} ${process.env.CDN_SECURE_TOKEN}`;
	const hash = crypto
		.createHash('md5')
		.update(hashStr)
		.digest('base64')
		.replace('/', '_')
		.replace('+', '-');
	return `https://${process.env.CDN_RESOURCE_URL}${filePath}?secure=${hash},${expiryTimestamp}`;
};

module.exports = genSignedUrl;
