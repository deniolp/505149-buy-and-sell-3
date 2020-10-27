'use strict';

const {Router} = require(`express`);

const {getSortedByCommentAmount} = require(`../../utils`);
const api = require(`../api`).getAPI();

const mainRouter = new Router();

mainRouter.get(`/`, async (req, res) => {
  const offers = await api.getOffers();
  res.render(`main`, {
    offers,
    title: `Главная страница`,
    mostDiscussed: getSortedByCommentAmount(offers),
  });
});
mainRouter.get(`/register`, (req, res) => res.render(`register`, {}));
mainRouter.get(`/login`, (req, res) => res.render(`login`, {}));
mainRouter.get(`/search`, async (req, res) => {
  const allOffers = await api.getOffers();
  const eightOffers = allOffers.slice(0, 8);
  const moreOffersQty = allOffers.length >= 8 ? (allOffers.length) - 8 : null;

  const encodedURI = encodeURI(req.query.query);
  const offers = await api.search(encodedURI);

  if (offers) {
    res.render(`search-result`, {offers, eightOffers, moreOffersQty});
  } else {
    res.render(`search-empty`, {eightOffers, moreOffersQty});
  }
});

module.exports = mainRouter;
