'use strict';

const express = require(`express`);
const chalk = require(`chalk`);

const {HttpCode} = require(`../../constants`);
const createApi = require(`../api`);
const DEFAULT_PORT = 3000;

const createApp = async () => {
  const app = express();
  const apiRoutes = await createApi();

  app.use(express.json());
  app.use(`/api`, apiRoutes);

  app.use((req, res) => res.status(HttpCode.NOT_FOUND)
  .send(`Not found`));

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
        return console.error(`Ошибка при создании сервера`, err);
      }

      return console.info(chalk.green(`Ожидаю соединений на ${port}`));
    });
  }
};
