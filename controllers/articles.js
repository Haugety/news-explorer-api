const Article = require('../models/article');

const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');
const messages = require('../utils/messages');

const getArticles = (req, res, next) => Article.find({})
  .then((data) => {
    if (!data) {
      throw new NotFoundError(messages.resourceNotFound);
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
  .orFail(new NotFoundError(messages.articleNotFound))
  .then((article) => {
    if (req.user._id.toString() === article.owner.toString()) {
      article.remove()
        .then(() => {
          res.status(200)
            .send({
              keyword: article.keyword,
              title: article.title,
              text: article.text,
              date: article.date,
              source: article.source,
              link: article.link,
              image: article.image,
            });
        });
    } else {
      throw new ForbiddenError(messages.forbidden);
    }
  })
  .catch(next);

module.exports = {
  getArticles,
  createArticle,
  removeArticle,
};
