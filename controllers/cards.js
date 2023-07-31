const Card = require('../models/card');
const { BadRequestError, NotFoundError, ServerError } = require('../error/error');

module.exports.addCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(BadRequestError).send({ message: 'Некорректные данные при создании карточки' });
      } else {
        res.status(ServerError).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(ServerError).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(NotFoundError).send({ message: 'Карточка с указанным _id не найдена' });
        return;
      }
      res.send({ message: 'Карточка удалена' });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(BadRequestError).send({ message: 'Некорректный _id карточки' });
      } else {
        res.status(ServerError).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        res.status(NotFoundError).send({ message: 'Карточка с указанным _id не найдена' });
        return;
      }
      res.send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(BadRequestError).send({ message: 'Некорректный _id карточки' });
      } else {
        res.status(ServerError).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        res.status(NotFoundError).send({ message: 'Карточка с указанным _id не найдена' });
        return;
      }
      res.send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(BadRequestError).send({ message: 'Некорректный _id карточки' });
      } else {
        res.status(ServerError).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
