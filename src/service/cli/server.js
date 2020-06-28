'use strict';

const express = require(`express`);

const {HttpCode} = require(`../../constants`);
const createApi = require(`../api`);
const {getLogger} = require(`../lib/logger`);

const DEFAULT_PORT = 3000;

const logger = getLogger();

const createApp = async () => {
  const app = express();
  const apiRoutes = await createApi();

  app.use(express.json());
  app.use((req, res, next) => {
    logger.debug(`Start request to url ${req.url}`);
    res.on(`finish`, () => {
      logger.info(`Response status code: ${res.statusCode}`);
    });

    next();
  });
  app.use(`/api`, apiRoutes);

  app.use((req, res) => {
    logger.error(`Did not find url: ${req.url}`);
    return res.status(HttpCode.NOT_FOUND)
      .send(`Not found`);
  });

  return app;
};

module.exports = {
  name: `--server`,
  createApp,
  async run(args) {
    const app = await createApp();
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    app.listen(port, (err) => {
      if (err) {
        return logger.error(`Ошибка при создании сервера: ${err}`);
      }

      return logger.info(`Ожидаю соединений на ${port} порт`);
    });
  }
};
