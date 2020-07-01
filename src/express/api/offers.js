'use strict';

const axios = require(`axios`);

const {getLogger} = require(`../../service/lib/logger`);

const logger = getLogger();

const HOST = `http://localhost:3000/`;

const getOffers = async () => {
  try {
    const response = (await axios.get(`${HOST}api/offers`)).data;
    return response;
  } catch (error) {
    return logger.error(error.message);
  }
};

module.exports = getOffers;
