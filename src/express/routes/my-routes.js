'use strict';

const {Router} = require(`express`);

const api = require(`../api`).getAPI();
const auth = require(`../middleware/auth`);
const {getLogger} = require(`../../service/lib/logger`);

const myRouter = new Router();

const logger = getLogger({
  name: `offers-routes`,
});

myRouter.get(`/`, auth, async (req, res) => {
  const {user} = req.session;
  const offers = await api.getOffers({comments: false, userId: user.id});
  res.render(`my-offers`, {offers, user});
});

myRouter.post(`/delete/:id`, auth, async (req, res) => {
  const {id} = req.params;
  const {user} = req.session;

  try {
    await api.deleteOffer(id, {userId: user.id});
    res.redirect(`/my`);
  } catch (err) {
    logger.error(err.message);
    res.redirect(`/my/?error=You have not right to delete this offer}`);
  }
});

myRouter.get(`/comments`, auth, async (req, res) => {
  const {user} = req.session;
  const offers = await api.getOffers({comments: true, userId: user.id});
  res.render(`comments`, {offers, user});
});

myRouter.post(`/delete-comment/:id`, auth, async (req, res) => {
  const {id} = req.params;
  const {user} = req.session;

  try {
    await api.deleteComment(id, {userId: user.id});
    res.redirect(`/my/comments`);
  } catch (err) {
    logger.error(err.message);
    res.redirect(`/my/?error=You have not right to delete this comment}`);
  }
});

module.exports = myRouter;
