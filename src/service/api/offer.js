'use strict';

const {Router} = require(`express`);

const {HttpCode} = require(`../../constants`);
const offerValidator = require(`../middlewares/offer-validator`);

const route = new Router();

module.exports = (app, service) => {
  app.use(`/offers`, route);

  route.get(`/`, (req, res) => {
    const offers = service.findAll();

    return res.status(HttpCode.OK)
        .json(offers);
  });

  route.get(`/:offerId`, (req, res) => {
    const {offerId} = req.params;
    const offer = service.findOne(offerId);

    if (!offer) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${offerId}`);
    }

    return res.status(HttpCode.OK)
        .json(offer);
  });

  route.post(`/`, offerValidator, (req, res) => {
    const offer = service.create(req.body);

    return res.status(HttpCode.CREATED)
      .json(offer);
  });
};
