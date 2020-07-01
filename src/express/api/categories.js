'use strict';

const axios = require(`axios`);

const HOST = `http://localhost:3000/`;

const getCategories = async () => {
  try {
    const response = (await axios.get(`${HOST}api/categories`)).data;
    return response;
  } catch (error) {
    return console.error(`error`);
  }
};

module.exports = getCategories;
