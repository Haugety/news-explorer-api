require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { userRouter } = require('./routes/users');
const { articleRouter } = require('./routes/articles');
const NotFoundError = require('./errors/not-found-err');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { validateLogin, validateCreateUser } = require('./middlewares/requestValidation');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/news-explorer-db', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());

app.use(cors());

app.use(requestLogger);

app.post('/signin', validateLogin, login);
app.post('/signup', validateCreateUser, createUser);

app.use(auth);

app.use(userRouter);
app.use(articleRouter);

app.all('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });

  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
