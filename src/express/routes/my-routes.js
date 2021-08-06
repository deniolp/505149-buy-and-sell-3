'use strict';

const {Router} = require(`express`);

const api = require(`../api`).getAPI();

const myRouter = new Router();

myRouter.get(`/`, async (req, res) => {
  const offers = await api.getOffers({comments: false});
  res.render(`my-offers`, {offers});
});

myRouter.get(`/comments`, async (req, res) => {
  const offers = await api.getOffers({comments: true});
  res.render(`comments`, {offers});
});

module.exports = myRouter;
