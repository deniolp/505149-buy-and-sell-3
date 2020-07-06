'use strict';

const axios = require(`axios`);

const {getLogger} = require(`../../service/lib/logger`);

const logger = getLogger();

const HOST = process.env.HOST || `http://localhost:3000/`;

const getSearchResults = async (query) => {
  try {
    const {data: response} = await axios.get(`${HOST}api/search/?search=${query}`);
    return response;
  } catch (error) {
    return logger.error(error.message);
  }
};

module.exports = getSearchResults;
