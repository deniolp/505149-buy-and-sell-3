'use strict';

const axios = require(`axios`);

const {getLogger} = require(`../../service/lib/logger`);

const logger = getLogger();

const HOST = process.env.HOST || `http://localhost:3000/`;

const getCategories = async () => {
  try {
    const {data: response} = await axios.get(`${HOST}api/categories`);
    return response;
  } catch (error) {
    return logger.error(error.message);
  }
};

module.exports = getCategories;
