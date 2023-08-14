const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimiter = require('express-rate-limit');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const NotfoundError = require('./error/NotFoundError');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res, next) => {
  next(new NotfoundError('Запрашиваемый ресурс не найден'));
});

const limiter = rateLimiter({
  max: 5,
  windowMS: 10000, // 10 seconds
  message: "You can't make any more requests at the moment. Try again later",
});
app.use(limiter);

app.use(errors());

app.use((error, req, res, next) => {
  const { statusCode = 500, message } = error;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT);
