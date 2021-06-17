const express = require('express');
const app = express();

app.use(express.json({ limit: '500kb' }));
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
	// console.log(req.body);
	next();
});

app.use('/api/user', require('./routes/user.routes'));
app.use('/api/episode', require('./routes/episode.routes'));

app.use('*', (req, res) => res.status(404).send('Not Found'));

module.exports = app;
