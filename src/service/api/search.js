'use strict';

const {Router} = require(`express`);

const {HttpCode} = require(`../../constants`);
const {getLogger} = require(`../lib/logger`);

const route = new Router();
const logger = getLogger({
  name: `api-server`,
});

module.exports = (app, service) => {
  app.use(`/search`, route);

  route.get(`/`, (req, res) => {
    const {query = ``} = req.query;

    if (!query) {
      logger.error(`Empty query...`);
      res.status(HttpCode.BAD_REQUEST).send(null);
      return;
    }

    const searchResults = service.findAll(query.toLowerCase());

    if (searchResults.length) {
      res.status(HttpCode.OK)
      .json(searchResults);
    } else {
      logger.info(`Did not find offers`);
      res.status(HttpCode.NOT_FOUND)
      .send(null);
    }
  });
};
