const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const UnauthorizedError = require('../errors/unauthorized-error');
const ConflictingRequestError = require('../errors/conflicting-request-err');

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
          }
          return user;
        });
    })
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      if (!token) {
        throw new UnauthorizedError('Токен не найден');
      }
      return res.status(200).send({ token });
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .orFail(new NotFoundError('Данного пользователя нет в базе'))
    .then((user) => res.status(200).send(user))
    .catch(next);
};

const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
    }))
    .catch((err) => {
      if (err.name === 'MongoError' || err.code === 11000) {
        throw new ConflictingRequestError('Пользователь с таким email уже зарегистрирован');
      }

      next(err);
    })
    .then(() => res.status(200).send({ message: 'Вы успешно зарегистрировались!' }))
    .catch(next);
};

module.exports = {
  login,
  getUser,
  createUser,
};
