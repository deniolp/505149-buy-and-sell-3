'use strict';

const Joi = require(`joi`);

module.exports = Joi.object({
  categories: Joi.array()
    .items(Joi.number()
      .integer()
      .positive())
    .min(1)
    .required(),

  title: Joi.string()
    .min(10)
    .max(100)
    .required(),

  description: Joi.string()
    .min(50)
    .max(1000)
    .required(),

  picture: Joi.string()
    .required(),

  type: Joi.any()
    .valid(`offer`, `buy`)
    .required(),

  sum: Joi.number()
    .integer()
    .greater(100)
    .required(),

  userId: Joi.number()
    .integer()
    .positive()
    .required()
});
