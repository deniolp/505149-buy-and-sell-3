'use strict';

const dateFormat = require(`dateformat`);
const logger = require(`pino`)({
  level: process.env.LOG_LEVEL || `info`,
  prettyPrint: {
    colorize: process.env.COLOR || false,
    translateTime: dateFormat(new Date(), `dd.m hh:MM`),
    ignore: `pid,hostname`,
  },
});

module.exports = {
  logger,
  getLogger(options = {}) {
    return logger.child(options);
  }
};
