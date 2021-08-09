'use strict';

const {Router} = require(`express`);

const {HttpCode} = require(`../../constants`);

const route = new Router();

module.exports = (app, service) => {
  app.use(`/categories`, route);

  route.get(`/`, async (req, res) => {
    const {needCount} = req.query;
    const categories = await service.findAll(needCount);
    res.status(HttpCode.OK)
      .json(categories);
  });
};
