'use strict';

const {Router} = require(`express`);

const api = require(`../api`).getAPI();
const {OFFERS_PER_PAGE} = require(`../../constants`);

const mainRouter = new Router();

mainRouter.get(`/`, async (req, res) => {
  let {page = 1} = req.query;
  page = +page;

  const limit = OFFERS_PER_PAGE;
  const offset = (page - 1) * OFFERS_PER_PAGE;

  const [{count, offers}, categories] = await Promise.all([
    api.getOffers({limit, offset, comments: true}),
    api.getCategories(true)
  ]);

  const mostDiscussed = offers.slice().sort((a, b) => b.comments.length - a.comments.length).slice(0, 8);

  const totalPages = Math.ceil(count / OFFERS_PER_PAGE);
  res.render(`main`, {
    offers,
    categories,
    title: `Главная страница`,
    mostDiscussed,
    page,
    totalPages,
  });
});

mainRouter.get(`/register`, (req, res) => res.render(`register`, {}));

mainRouter.get(`/login`, (req, res) => res.render(`login`, {}));

mainRouter.get(`/search`, async (req, res) => {
  let {page = 1} = req.query;
  const query = req.query.query;
  page = +page;

  const limit = OFFERS_PER_PAGE;
  const offset = (page - 1) * OFFERS_PER_PAGE;

  const [offers, {count, foundOffers}] = await Promise.all([
    api.getOffers({comments: true}),
    api.search({limit, offset, query})
  ]);

  const mostDiscussed = offers.slice().sort((a, b) => b.comments.length - a.comments.length).slice(0, 8);

  const moreOffersQty = count >= OFFERS_PER_PAGE ? (count) - OFFERS_PER_PAGE : null;

  const totalPages = Math.ceil(count / OFFERS_PER_PAGE);

  if (foundOffers.length > 0) {
    res.render(`search-result`, {count, foundOffers, mostDiscussed, page, totalPages, query, moreOffersQty});
  } else {
    res.render(`search-empty`, {mostDiscussed});
  }
});

module.exports = mainRouter;
