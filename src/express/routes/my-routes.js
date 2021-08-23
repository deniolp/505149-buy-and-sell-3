'use strict';

const {Router} = require(`express`);

const api = require(`../api`).getAPI();

const myRouter = new Router();

myRouter.get(`/`, async (req, res) => {
  const {user} = req.session;
  const offers = await api.getOffers({comments: false});
  res.render(`my-offers`, {offers, user});
});

myRouter.get(`/comments`, async (req, res) => {
  const {user} = req.session;
  const offers = await api.getOffers({comments: true});
  res.render(`comments`, {offers, user});
});

module.exports = myRouter;
