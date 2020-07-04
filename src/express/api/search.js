'use strict';

const axios = require(`axios`);

const {getLogger} = require(`../../service/lib/logger`);

const logger = getLogger();

const HOST = `http://localhost:3000/`;

const getSearchResults = async (query) => {
  try {
    const response = (await axios.get(`${HOST}api/search/?search=${query}`)).data;
    return response;
  } catch (error) {
    return logger.error(error.message);
  }
};

module.exports = getSearchResults;
