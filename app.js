const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');
const hpp = require('hpp');
const app = express();

app.use(cors({ credentials: true }));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(hpp());

app.use('/api/user', require('./routes/user.rout`es'));
app.use('/api/episode', require('./routes/episode.routes'));
app.use('/api/model', require('./routes/model.routes'));
app.use('/api/favorite', require('./routes/favorite.routes'));
app.use('/api/stream', require('./routes/stream.routes'));
app.use('/api/', require('./routes/general.routes'));

app.use('*', (req, res) => res.status(404).send('Not Found'));

app.use(require('./error/handler.error'));

module.exports = app;
