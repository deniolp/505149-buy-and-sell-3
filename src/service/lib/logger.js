'use strict';

const pino = require(`pino`);
const {Env} = require(`../../constants`);

const isDevMode = process.env.NODE_ENV === Env.DEVELOPMENT;
const isFront = process.env.IS_FRONT;
const LOG_FILE = isFront ? `src/logs/front.log` : `src/logs/api.log`;
const defaultLogLevel = isDevMode ? `debug` : `error`;

const logger = pino({
  name: `base-logger`,
  level: process.env.LOG_LEVEL || defaultLogLevel,
  prettyPrint: {
    colorize: process.env.COLOR || false,
    translateTime: `SYS:standard`,
    ignore: `pid,hostname`,
  },
}, isDevMode ? pino.destination(LOG_FILE) : process.stdout);

module.exports = {
  logger,
  getLogger(options = {}) {
    return logger.child(options);
  }
};
