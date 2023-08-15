const jwt = require('jsonwebtoken');
const UnautorizedError = require('../error/UnautorizedError');

const { SECRET_KEY = 'mestogha' } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnautorizedError('Необходима авторизация'));
    return;
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    next(new UnautorizedError('Необходима авторизация'));
    return;
  }
  req.user = payload;
  next();
};
