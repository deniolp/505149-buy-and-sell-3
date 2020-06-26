'use strict';

const {HttpCode} = require(`../../constants`);
const {getLogger} = require(`../lib/logger`);

const logger = getLogger();

module.exports = (service) => (req, res, next) => {
  const {offerId} = req.params;
  const offer = service.findOne(offerId);

  if (!offer) {
    logger.error(`Did not found offer with ${offerId}`);
    return res.status(HttpCode.NOT_FOUND)
      .send(`Offer with ${offerId} not found`);
  }

  res.locals.offer = offer;
  return next();
};
