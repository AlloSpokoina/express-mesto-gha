const User = require('../models/user');
const { BadRequestError, NotFoundError, ServerError } = require('../error/error');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(ServerError).send({ message: 'Произошла ошибка' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(NotFoundError).send({ message: 'Пользователь с данным _id не найден' });
        return;
      }
      res.send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(BadRequestError).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(ServerError).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.addUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(BadRequestError).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(ServerError).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.editUserData = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: 'true', runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(NotFoundError).send({ message: 'Пользователь с данным _id не найден' });
        return;
      }
      res.send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(BadRequestError).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(ServerError).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.editUserAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, { new: 'true', runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(NotFoundError).send({ message: 'Пользователь с данным _id не найден' });
        return;
      }
      res.send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(BadRequestError).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(ServerError).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
