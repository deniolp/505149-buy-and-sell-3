'use strict';

const chalk = require(`chalk`);
const express = require(`express`);

const {HttpCode} = require(`../../../src/constants`);
const routes = require(`../api`);
const getMockData = require(`../lib/get-mock-data`);
const DEFAULT_PORT = 3000;

const app = express();
app.use(express.json());
app.use(`/api`, routes);

app.get(`/offers`, async (req, res) => {
  try {
    const mocks = await getMockData();
    res.json(mocks);
  } catch (err) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).send([]);
  }
});

app.use((req, res) => res.status(HttpCode.NOT_FOUND)
  .send(`Not found`));

module.exports = {
  name: `--server`,
  run(args) {
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
