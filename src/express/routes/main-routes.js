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

  const mostDiscussed = offers.slice().sort((a, b) => b.comments.length - a.comments.length).slice(0, 4);

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
  const encodedURI = encodeURI(req.query.query);
  const result = await api.search(encodedURI);
  const {count, searchResult, eightOffers} = result;
  const moreOffersQty = count >= OFFERS_PER_PAGE ? (count) - OFFERS_PER_PAGE : null;

  if (searchResult) {
    res.render(`search-result`, {searchResult, eightOffers, moreOffersQty});
  } else {
    res.render(`search-empty`, {eightOffers, moreOffersQty});
  }
});

module.exports = mainRouter;
