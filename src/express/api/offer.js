'use strict';

const axios = require(`axios`);

const {getLogger} = require(`../../service/lib/logger`);

const logger = getLogger();

const HOST = process.env.HOST || `http://localhost:3000/`;

const getOffer = async (id) => {
  try {
    const {data: response} = await axios.get(`${HOST}api/offers/${id}`);
    return response;
  } catch (error) {
    return logger.error(error.message);
  }
};

module.exports = getOffer;
