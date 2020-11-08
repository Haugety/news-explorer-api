const { NODE_ENV, JWT_SECRET, DEV_JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');

const UnauthorizedError = require('../errors/unauthorized-error');
const messages = require('../utils/messages');

module.exports = (req, res, next) => {
  const { authorization = '' } = req.headers;

  if (!authorization && !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError(messages.needToLogin);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : DEV_JWT_SECRET);
  } catch (err) {
    next(new UnauthorizedError(messages.needToLogin));
  }

  req.user = payload;

  next();
};
