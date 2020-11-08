const router = require('express').Router();

const {
  getUser,
} = require('../controllers/users');
const NotFoundError = require('../errors/not-found-err');

router.get(
  '/users/me',
  getUser,
);

router.get(
  '/users/:char',
  (req, res, next) => {
    next(new NotFoundError('Запрашиваемые данные отсутствуют'));
  },
);

module.exports = {
  userRouter: router,
};
