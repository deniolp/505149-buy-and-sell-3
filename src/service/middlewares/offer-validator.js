'use strict';

const schema = require(`../schemas/offer`);

const {HttpCode} = require(`../../constants`);

module.exports = (req, res, next) => {
  const newOffer = req.body;

  const {error} = schema.validate(newOffer);

  if (error) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};
