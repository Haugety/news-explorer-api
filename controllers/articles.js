const Article = require('../models/article');

const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

const getArticles = (req, res, next) => Article.find({})
  .then((data) => {
    if (!data) {
      throw new NotFoundError('Запрашиваемые данные отсутствуют');
    }
    res.status(200).send(data);
  })
  .catch(next);

const createArticle = (req, res, next) => Article.create({
  keyword: req.body.keyword,
  title: req.body.title,
  text: req.body.text,
  date: req.body.date,
  source: req.body.source,
  link: req.body.link,
  image: req.body.image,
  owner: req.user._id,
})
  .then((article) => res.status(200).send({
    keyword: article.keyword,
    title: article.title,
    text: article.text,
    date: article.date,
    source: article.source,
    link: article.link,
    image: article.image,
  }))
  .catch(next);

const removeArticle = (req, res, next) => Article.findById(req.params._id).select('+owner')
  .orFail(new NotFoundError('Данной карточки нет в базе'))
  .then((article) => {
    if (req.user._id.toString() === article.owner.toString()) {
      article.remove();
      res.status(200).send({
        keyword: article.keyword,
        title: article.title,
        text: article.text,
        date: article.date,
        source: article.source,
        link: article.link,
        image: article.image,
      });
    } else {
      throw new ForbiddenError('Доступ запрещен');
    }
  })
  .catch(next);

module.exports = {
  getArticles,
  createArticle,
  removeArticle,
};
