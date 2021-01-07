'use strict';

const {Router} = require(`express`);

const category = require(`../api/category`);
const offer = require(`../api/offer`);
const search = require(`../api/search`);

const {
  CategoryService,
  SearchService,
  OfferService,
  CommentService,
} = require(`../data-service`);

const createApi = async (db, logger) => {
  const agregatingRouter = new Router();

  category(agregatingRouter, new CategoryService(db, logger));
  offer(agregatingRouter, new OfferService(db, logger), new CommentService(db, logger));
  search(agregatingRouter, new SearchService(db, logger));

  return agregatingRouter;
};

module.exports = createApi;
