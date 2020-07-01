'use strict';

const {Router} = require(`express`);

const getOffers = require(`../api/offers`);

const offersRouter = new Router();

offersRouter.get(`/add`, (req, res) => res.render(`new-ticket`, {}));
offersRouter.get(`/category`, (req, res) => res.render(`category`, {}));
offersRouter.get(`/:id`, (req, res) => res.render(`ticket`, {}));
offersRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const offers = await getOffers();
  const offer = await offers.find((item) => item.id === id);

  res.render(`ticket-edit`, {
    offer,
  });
});

module.exports = offersRouter;
