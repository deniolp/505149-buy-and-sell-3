'use strict';

const {Router} = require(`express`);

const api = require(`../api`).getAPI();
const {getLogger} = require(`../../service/lib/logger`);
const upload = require(`../middleware/upload`);
const {OFFERS_PER_PAGE} = require(`../../constants`);

const mainRouter = new Router();

const logger = getLogger({
  name: `main-routes`,
});

mainRouter.get(`/`, async (req, res) => {
  let {page = 1} = req.query;
  page = +page;

  const limit = OFFERS_PER_PAGE;
  const offset = (page - 1) * OFFERS_PER_PAGE;

  try {
    const [{count, offers}, categories] = await Promise.all([
      api.getOffers({limit, offset, comments: true}),
      api.getCategories(true)
    ]);

    const mostDiscussed = offers.slice().sort((a, b) => b.comments.length - a.comments.length).slice(0, 8);

    const totalPages = Math.ceil(count / OFFERS_PER_PAGE);
    return res.render(`main`, {
      offers,
      categories,
      title: `Главная страница`,
      mostDiscussed,
      page,
      totalPages,
    });
  } catch (error) {
    logger.error(error.message);
    return res.render(`errors/500`, {title: `Ошибка сервера`});
  }
});

mainRouter.get(`/register`, (req, res) => {
  const {error} = req.query;
  res.render(`register`, {error});
});

mainRouter.post(`/register`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;
  const userData = {
    avatar: file.filename,
    name: body[`user-name`],
    email: body[`user-email`],
    password: body[`user-password`],
    passwordRepeated: body[`user-password-again`]
  };

  try {
    await api.createUser(userData);
    res.redirect(`/login`);
  } catch (error) {
    res.redirect(`/register?error=${encodeURIComponent(error.response.data)}`);
  }
});

mainRouter.get(`/login`, (req, res) => res.render(`login`, {}));

mainRouter.get(`/search`, async (req, res) => {
  let {page = 1} = req.query;
  const query = req.query.query;
  page = +page;

  const limit = OFFERS_PER_PAGE;
  const offset = (page - 1) * OFFERS_PER_PAGE;

  try {
    const offers = await api.getOffers({comments: true});

    const mostDiscussed = offers.slice().sort((a, b) => b.comments.length - a.comments.length).slice(0, 8);

    if (!query) {
      return res.render(`search-empty`, {mostDiscussed});
    }

    const {count, foundOffers} = await api.search({limit, offset, query});

    const moreOffersQty = count >= OFFERS_PER_PAGE ? (count - offset) - OFFERS_PER_PAGE : null;

    const totalPages = Math.ceil(count / OFFERS_PER_PAGE);

    if (foundOffers.length > 0) {
      return res.render(`search-result`, {count, foundOffers, mostDiscussed, page, totalPages, query, moreOffersQty});
    } else {
      return res.render(`search-empty`, {mostDiscussed});
    }
  } catch (error) {
    logger.error(error.message);
    return res.render(`errors/500`, {title: `Ошибка сервера`});
  }
});

module.exports = mainRouter;
