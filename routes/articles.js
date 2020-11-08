const router = require('express').Router();
const {
  getArticles,
  createArticle,
  removeArticle,
} = require('../controllers/articles');
const { validateCreateArticle, validateRemoveArticle } = require('../middlewares/requestValidation');

router.delete(
  '/articles/:_id',
  validateRemoveArticle,
  removeArticle,
);

router.get(
  '/articles',
  getArticles,
);

router.post(
  '/articles',
  validateCreateArticle,
  createArticle,
);

module.exports = {
  articleRouter: router,
};
