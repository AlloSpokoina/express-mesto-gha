const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimiter = require('express-rate-limit');
const { errors } = require('celebrate');
const NotfoundError = require('./error/NotFoundError');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

const limiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 50,
});
app.use(limiter);

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(helmet());

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(errors());
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res, next) => {
  next(new NotfoundError('Запрашиваемый ресурс не найден'));
});

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
