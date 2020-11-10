const router = require('express').Router();

const { userRouter } = require('./users');
const { articleRouter } = require('./articles');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { validateLogin, validateCreateUser } = require('../middlewares/requestValidation');
const NotFoundError = require('../errors/not-found-err');
const messages = require('../utils/messages');

router.post('/signin', validateLogin, login);
router.post('/signup', validateCreateUser, createUser);

router.use(auth);

router.use(userRouter);
router.use(articleRouter);

router.all('*', (req, res, next) => {
  next(new NotFoundError(messages.resourceNotFound));
});

module.exports = router;
