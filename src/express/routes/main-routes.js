'use strict';

const {Router} = require(`express`);

const getOffers = require(`../api/offers`);
const getCategories = require(`../api/categories`);
const getSearchResults = require(`../api/search`);
const {getSortedByCommentAmount} = require(`../../utils`);

const mainRouter = new Router();

mainRouter.get(`/`, async (req, res) => {
  const offers = await getOffers();
  const categories = await getCategories();

  res.render(`main`, {
    offers,
    mostDiscussed: getSortedByCommentAmount(offers),
    categories,
  });
});
mainRouter.get(`/register`, (req, res) => res.render(`register`, {}));
mainRouter.get(`/login`, (req, res) => res.render(`login`, {}));
mainRouter.get(`/search`, async (req, res) => {
  const allOffers = await getOffers();
  const eightOffers = allOffers.slice(0, 8);
  const moreOffersQty = allOffers.length >= 8 ? (allOffers.length) - 8 : null;

  const encodedURI = encodeURI(req.query.query);
  const offers = await getSearchResults(encodedURI);

  if (offers) {
    res.render(`search-result`, {offers, eightOffers, moreOffersQty});
  } else {
    res.render(`search-empty`, {eightOffers, moreOffersQty});
  }
});

module.exports = mainRouter;
