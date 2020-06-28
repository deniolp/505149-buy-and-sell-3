'use strict';

const fs = require(`fs`);
const pinoms = require(`pino-multi-stream`);

const prettyStream = pinoms.prettyStream({
  prettyPrint: {
    colorize: true,
    translateTime: `dd-mm-yyyy HH:MM:ss`,
    ignore: `hostname,pid`,
    levelFirst: true,
  },
  prettifier: require(`pino-pretty`)
});

const level = process.env.LOG_LEVEL || `info`;
const streams = [
  {level, stream: prettyStream},
  {level, stream: fs.createWriteStream(`./src/service/logs/all.txt`)},
  {level: `error`, stream: fs.createWriteStream(`./src/service/logs/errors.txt`)},
];

const logger = pinoms({
  name: `pino-in-express`,
  level,
}, pinoms.multistream(streams));

module.exports = {
  logger,
  getLogger(options = {}) {
    return logger.child(options);
  }
};
