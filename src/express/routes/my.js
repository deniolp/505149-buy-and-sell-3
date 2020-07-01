'use strict';

const {Router} = require(`express`);

const getOffers = require(`../api/offers`);
const getCategories = require(`../api/categories`);
const {getSortedByCommentAmount} = require(`../../utils`);


const myRouter = new Router();

myRouter.get(`/`, async (req, res) => {
  const offers = await getOffers();
  const categories = await getCategories();

  res.render(`main`, {
    offers,
    mostDiscussed: getSortedByCommentAmount(offers),
    categories,
  });
});
myRouter.get(`/comments`, async (req, res) => {
  const offers = (await getOffers()).slice(0, 3);

  res.render(`comments`, {offers});
});

module.exports = myRouter;
