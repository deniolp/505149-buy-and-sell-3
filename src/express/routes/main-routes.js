'use strict';

const {Router} = require(`express`);

const {getSortedByCommentAmount} = require(`../../utils`);
const api = require(`../api`).getAPI();

const OFFERS_PER_PAGE = 8;

const mainRouter = new Router();

mainRouter.get(`/`, async (req, res) => {
  let {page = 1} = req.query;
  page = +page;

  const limit = OFFERS_PER_PAGE;
  const offset = (page - 1) * OFFERS_PER_PAGE;
  const {count, offers} = await api.getOffers({limit, offset});
  const totalPages = Math.ceil(count / OFFERS_PER_PAGE);
  res.render(`main`, {
    offers,
    title: `Главная страница`,
    mostDiscussed: getSortedByCommentAmount(offers),
    page,
    totalPages,
  });
});
mainRouter.get(`/register`, (req, res) => res.render(`register`, {}));
mainRouter.get(`/login`, (req, res) => res.render(`login`, {}));
mainRouter.get(`/search`, async (req, res) => {
  const allOffers = await api.getOffers();
  const eightOffers = allOffers.slice(0, OFFERS_PER_PAGE);
  const moreOffersQty = allOffers.length >= OFFERS_PER_PAGE ? (allOffers.length) - OFFERS_PER_PAGE : null;

  const encodedURI = encodeURI(req.query.query);
  const offers = await api.search(encodedURI);

  if (offers) {
    res.render(`search-result`, {offers, eightOffers, moreOffersQty});
  } else {
    res.render(`search-empty`, {eightOffers, moreOffersQty});
  }
});

module.exports = mainRouter;
