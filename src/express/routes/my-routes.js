'use strict';

const {Router} = require(`express`);

const api = require(`../api`).getAPI();
const auth = require(`../middleware/auth`);

const myRouter = new Router();

myRouter.get(`/`, auth, async (req, res) => {
  const {user} = req.session;
  const offers = await api.getOffers({comments: false, userId: user.id});
  res.render(`my-offers`, {offers, user});
});

myRouter.get(`/comments`, auth, async (req, res) => {
  const {user} = req.session;
  const offers = await api.getOffers({comments: true, userId: user.id});
  res.render(`comments`, {offers, user});
});

module.exports = myRouter;
