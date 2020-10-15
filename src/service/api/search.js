'use strict';

const {Router} = require(`express`);

const {HttpCode} = require(`../../constants`);
const {getLogger} = require(`../lib/logger`);

const route = new Router();
const logger = getLogger({
  name: `pino-from-service`,
});

module.exports = (app, service) => {
  app.use(`/search`, route);

  route.get(`/`, (req, res) => {
    const {search = ``} = req.query;

    if (!search) {
      logger.error(`Empty query...`);
      res.status(HttpCode.BAD_REQUEST).json([]);
      return;
    }

    const searchResults = service.findAll(search.toLowerCase());
    const searchStatus = searchResults.length > 0 ? HttpCode.OK : HttpCode.NOT_FOUND;

    res.status(searchStatus)
      .json(searchResults);
  });
};
