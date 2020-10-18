'use strict';

const {Router} = require(`express`);

const api = require(`../api`).getAPI();

const myRouter = new Router();

let myOffers = null;

myRouter.get(`/`, async (req, res) => {
  myOffers = await api.getOffers();

  res.render(`my-offers`, {
    myOffers,
  });
});

myRouter.get(`/comments`, async (req, res) => {
  if (!myOffers) {
    myOffers = (await api.getOffers()).slice(0, 3);
  }
  const offersId = myOffers.map((it) => it.id);
  await Promise.all(offersId.map((id) => api.getComments(id)))
      .then((results) => {
        for (const [index, array] of results.entries()) {
          myOffers[index].comments = array;
        }
      });

  res.render(`comments`, {myOffers});
});

module.exports = myRouter;
