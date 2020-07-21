'use strict';

const {getLogger} = require(`../lib/logger`);

const logger = getLogger();

module.exports = {
  name: `--help`,
  run() {
    const text = `
    Гайд:
      Команды:
      --server <port>    запускает http-сервер
      --version:            выводит номер версии
      --help:               печатает этот текст
      --generate <count>    формирует файл mocks.json
      --fill <count>    формирует файл fill-db.sql
    `;

    logger.info(text);
  }
};
