const { AppError, httpStatusCodes } = require('../error/createError');
const ImageKit = require('imagekit');

const imageKit = new ImageKit({
	publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
	privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
	urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

exports.uploadFile = async (buffer, fileName) => {
	let response;
	try {
		response = await imageKit.upload({
			folder: 'uploads',
			file: buffer,
			fileName: fileName
		});

		return { path: response.name, id: response.fileId };
	} catch (error) {
		throw new AppError(
			httpStatusCodes.INTERNAL_SERVER,
			`Error while uploading file(ImageKit): ${error}`
		);
	}
};

exports.deleteFile = async (fileId) => {
	try {
		await imageKit.deleteFile(fileId);
	} catch (error) {
		throw new AppError(
			httpStatusCodes.INTERNAL_SERVER,
			`Error while deleting file(ImageKit): ${error}`
		);
	}
};
