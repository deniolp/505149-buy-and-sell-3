'use strict';

const fs = require(`fs`).promises;

const {getLogger} = require(`../lib/logger`);

const FILENAME = `mocks.json`;

const logger = getLogger({
  name: `api-server`,
});
let data = [];

const getMockData = async () => {
  if (data.length > 0) {
    return data;
  }

  try {
    const fileContent = await fs.readFile(FILENAME);
    data = JSON.parse(fileContent);
  } catch (err) {
    logger.error(err);
  }

  return data;
};

module.exports = getMockData;
