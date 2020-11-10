const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const UnauthorizedError = require('../errors/unauthorized-error');
const ConflictingRequestError = require('../errors/conflicting-request-err');
const messages = require('../utils/messages');
const { devJwtSecret } = require('../utils/config');

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError(messages.invalidData);
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError(messages.invalidData));
          }
          return user;
        });
    })
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : devJwtSecret,
        { expiresIn: '7d' },
      );
      if (!token) {
        throw new UnauthorizedError(messages.tokenNotFound);
      }
      return res.status(200).send({ token });
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .orFail(new NotFoundError(messages.userNotFound))
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
        throw new ConflictingRequestError(messages.emailConflict);
      }

      next(err);
    })
    .then(() => res.status(200).send({ message: messages.successRegistration }))
    .catch(next);
};

module.exports = {
  login,
  getUser,
  createUser,
};
