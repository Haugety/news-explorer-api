const { celebrate, Joi } = require('celebrate');
const { isURL } = require('validator');

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
});

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    name: Joi.string().required().min(2).max(30),
  }),
});

const validateRemoveArticle = celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().hex().length(24).required(),
  }),
});

const validateCreateArticle = celebrate({
  body: Joi.object().keys({
    id: Joi.string().required(),
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().custom((value, helpers) => {
      if (!isURL(value)) {
        return helpers.error('any.invalid');
      }
      return value;
    }),
    image: Joi.string().required().custom((value, helpers) => {
      if (!isURL(value)) {
        return helpers.error('any.invalid');
      }
      return value;
    }),
  }),
});

module.exports = {
  validateLogin,
  validateCreateUser,
  validateCreateArticle,
  validateRemoveArticle,
};
