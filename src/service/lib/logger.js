'use strict';

const logger = require(`pino`)({
  name: `pino-in-express`,
  level: process.env.LOG_LEVEL || `info`
});

module.exports = {
  logger,
  getLogger(options = {}) {
    return logger.child(options);
  }
};
