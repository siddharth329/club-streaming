const logger = require('./config/logger');
const dotenv = require('dotenv')

process.on('uncaughtException', (err) => {
	logger.error(`Uncaught Exception In The process: ${err}`);
	process.exit(1);
});

dotenv.config()
const app = require('./app');

const PORT = process.env.PORT || 5000;
const env = process.env.NODE_ENV;
const server = app.listen(PORT, (err) => {
	if (err) return logger.error(`Something went wrong: ${err}`);
	logger.info(`Server started in ${env} on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
	logger.error('Unhandled Rejection In the process: ${err}');
	server.close(() => process.exit(1));
});
