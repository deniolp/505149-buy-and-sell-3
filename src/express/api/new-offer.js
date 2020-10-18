'use strict';

const axios = require(`axios`);

const {getLogger} = require(`../../service/lib/logger`);

const logger = getLogger({
  name: `front-server-axios`,
});

const HOST = process.env.HOST || `http://localhost:3000/`;

const postOffer = async (offer) => {
  try {
    const {data: response} = await axios({
      method: `post`,
      url: `${HOST}api/offers`,
      data: offer
    });
    return response;
  } catch (error) {
    return logger.error(error.message);
  }
};

module.exports = postOffer;
