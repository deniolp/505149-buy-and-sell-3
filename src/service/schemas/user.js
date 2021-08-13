'use strict';

const Joi = require(`joi`);

const {RegisterMessage} = require(`../../constants`);

module.exports = Joi.object({
  name: Joi.string().pattern(/[^0-9$&+,:;=?@#|'<>.^*()%!]+$/)
    .required()
    .messages({
      'string.pattern.base': RegisterMessage.WRONG_EMAIL,
      'any.required': RegisterMessage.REQUIRED_FIELD,
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      'any.required': RegisterMessage.REQUIRED_FIELD,
    }),

  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': RegisterMessage.MIN_PASSWORD_LENGTH,
      'any.required': RegisterMessage.REQUIRED_FIELD,
    }),

  passwordRepeated: Joi.string()
    .valid(Joi.ref(`password`))
    .required()
    .messages({
      'any.only': RegisterMessage.PASSWORDS_NOT_EQUALS,
    }),

  avatar: Joi.string()
    .required()
    .messages({
      'string.empty': RegisterMessage.EMPTY_VALUE_IMAGE,
    })
});
