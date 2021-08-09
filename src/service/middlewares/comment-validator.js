'use strict';

const schema = require(`../schemas/comment`);

const {HttpCode} = require(`../../constants`);

module.exports = (req, res, next) => {
  const comment = req.body;

  const {error} = schema.validate(comment);

  if (error) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};
