const router = require('express').Router();
const {
  getCards, deleteCard, addCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.get('/:cardId', deleteCard);
router.post('/', addCard);
router.patch('/cardId/likes', likeCard);
router.patch('/:cardId/likes', dislikeCard);

module.exports = router;
