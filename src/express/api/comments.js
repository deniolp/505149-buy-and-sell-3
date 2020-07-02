'use strict';

const axios = require(`axios`);

const {getLogger} = require(`../../service/lib/logger`);

const logger = getLogger();

const HOST = `http://localhost:3000/`;

const getComments = async (id) => {
  try {
    const response = (await axios.get(`${HOST}api/offers/${id}/comments`)).data;
    return response;
  } catch (error) {
    return logger.error(error.message);
  }
};

module.exports = getComments;
