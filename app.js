const cors = require('cors');
const createError = require('http-errors')
const express = require('express');
const path = require('path');
const logger = require('morgan');
const helmet = require('helmet')
const routes = require('./routes');

const app = express();

app.use(cors({ origin: true }));
app.use(helmet({ hsts: false }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended:false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next)=> {
  res.status(err.status || 500);
  if (err.status === 401) {
    res.set('WWW-Authenticate', 'Bearer');
  }
  res.json({
    message: err.message,
    error: JSON.parse(JSON.stringify(err)),
  })
})

module.exports = app;
