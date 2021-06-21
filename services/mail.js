const sgMail = require('@sendgrid/mail');
const logger = require('../config/logger');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.mail = async (data) => {
	data.from = 'apper329@gmail.com';
	if (!data.to || !data.subject || !data.html) {
		logger.warn('Required fields for the mail was not found in the payload data');
	}

	try {
		await sgMail.send(data);
		//
	} catch (error) {
		logger.error(error);

		if (error.response) {
			logger.warn(`Error Response from sgMail: ${error.response}`);
		}
	}
};
