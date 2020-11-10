const router = require('express').Router();
const messages = require('../utils/messages');

const { getUser } = require('../controllers/users');
const NotFoundError = require('../errors/not-found-err');

router.get(
  '/users/me',
  getUser,
);

router.get(
  '/users/:char',
  (req, res, next) => {
    next(new NotFoundError(messages.resourceNotFound));
  },
);

module.exports = {
  userRouter: router,
};
