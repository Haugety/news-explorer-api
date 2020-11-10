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
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

const { devDataBaseAddress } = require('./utils/config');
const router = require('./routes/index');

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

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use(errorsHandler);

app.listen(PORT);
