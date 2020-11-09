require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const {
  PORT = 3000,
  NODE_ENV,
  DATABASE_ADDRESS,
} = process.env;

const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const limiter = require('./middlewares/limiter');
const errorsHandler = require('./middlewares/errorsHandler');
const auth = require('./middlewares/auth');
const { validateLogin, validateCreateUser } = require('./middlewares/requestValidation');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

const NotFoundError = require('./errors/not-found-err');
const messages = require('./utils/messages');
const { devDataBaseAddress } = require('./utils/config');
const router = require('./routes/index');
const { login, createUser } = require('./controllers/users');

mongoose.connect(NODE_ENV === 'production' ? DATABASE_ADDRESS : devDataBaseAddress, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(helmet());

app.use(cors());

app.use(limiter);

app.use(bodyParser.json());

app.use(requestLogger);

app.post('/signin', validateLogin, login);
app.post('/signup', validateCreateUser, createUser);

app.use(auth);

app.use(router);

app.all('*', (req, res, next) => {
  next(new NotFoundError(messages.resourceNotFound));
});

app.use(errorLogger);

app.use(errors());

app.use(errorsHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
