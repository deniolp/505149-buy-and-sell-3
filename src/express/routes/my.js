'use strict';

const {Router} = require(`express`);

const getOffers = require(`../api/offers`);

const myRouter = new Router();

myRouter.get(`/`, async (req, res) => {
  const offers = await getOffers();

  res.render(`my-tickets`, {
    offers,
  });
});
myRouter.get(`/comments`, async (req, res) => {
  const offers = (await getOffers()).slice(0, 3);

  res.render(`comments`, {offers});
});

module.exports = myRouter;
