'use strict';

const pino = require(`pino`);
const dateFormat = require(`dateformat`);
const {Env} = require(`../../constants`);

const isDevMode = process.env.NODE_ENV === Env.DEVELOPMENT;
const isFront = process.env.IS_FRONT;
const LOG_FILE = isFront ? `src/logs/front.log` : `src/logs/api.log`;
const defaultLogLevel = isDevMode ? `info` : `error`;

const logger = pino({
  name: `base-logger`,
  level: process.env.LOG_LEVEL || defaultLogLevel,
  prettyPrint: {
    colorize: process.env.COLOR || false,
    translateTime: dateFormat(new Date(), `dd.m h:MM T`),
    ignore: `pid,hostname`,
  },
}, isDevMode ? process.stdout : pino.destination(LOG_FILE));

module.exports = {
  logger,
  getLogger(options = {}) {
    return logger.child(options);
  }
};
