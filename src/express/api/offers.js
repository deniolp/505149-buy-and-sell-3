'use strict';

const axios = require(`axios`);

const HOST = `http://localhost:3000/`;

const getOffers = async () => {
  try {
    const response = (await axios.get(`${HOST}api/offers`)).data;
    return response;
  } catch (error) {
    return console.error(`error`);
  }
};

module.exports = getOffers;
