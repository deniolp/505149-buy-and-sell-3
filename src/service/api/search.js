'use strict';

const {Router} = require(`express`);

const {HttpCode} = require(`../../constants`);

const route = new Router();

module.exports = (app, service) => {
  app.use(`/search`, route);

  route.get(`/`, async (req, res) => {
    const {offset, limit, query} = req.query;

    const searchResults = await service.findAll({offset, limit, query});

    res.status(HttpCode.OK)
    .json(searchResults);
  });
};
