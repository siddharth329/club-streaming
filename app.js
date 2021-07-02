const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const app = express();

app.use(express.json({ limit: '500kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

// if (process.env.NODE_ENV === 'development') app.use(require('morgan')('combined'));

app.use('/api/user', require('./routes/user.routes'));
app.use('/api/episode', require('./routes/episode.routes'));
app.use('/api/model', require('./routes/model.routes'));
app.use('/api/favorite', require('./routes/favorite.routes'));
app.use('/api/stream', require('./routes/stream.routes'));
app.use('/api/', require('./routes/general.routes'));

app.use('*', (req, res) => res.status(404).send('Not Found'));

module.exports = app;
