'use strict';

const {Router} = require(`express`);

const {HttpCode} = require(`../../constants`);
const offerValidator = require(`../middlewares/offer-validator`);
const commentValidator = require(`../middlewares/comment-validator`);
const offerExist = require(`../middlewares/offer-exist`);
const commentExist = require(`../middlewares/comment-exist`);
const routeParamsValidator = require(`../middlewares/route-params-validator`);
const {getLogger} = require(`../lib/logger`);

const route = new Router();
const logger = getLogger({
  name: `api-server-offer`,
});

module.exports = (app, offerService, commentService) => {
  app.use(`/offers`, route);

  route.get(`/`, async (req, res) => {
    const {limit, offset, comments, userId} = req.query;
    let result;

    try {
      if (limit || offset) {
        result = await offerService.findPage({limit, offset, comments});
      } else {
        if (userId) {
          result = await offerService.findAllByUser(userId, comments);
        } else {
          result = await offerService.findAll(comments);
        }
      }

      res.status(HttpCode.OK).json(result);
    } catch (err) {
      logger.error(`Error status - ${HttpCode.INTERNAL_SERVER_ERROR}`);
      res.status(HttpCode.INTERNAL_SERVER_ERROR).send(err);
    }
  });

  route.get(`/:offerId`, routeParamsValidator, async (req, res) => {
    const {offerId} = req.params;
    const {comments} = req.query;
    const offer = await offerService.findOne(offerId, comments);

    if (!offer) {
      logger.error(`Error status - ${HttpCode.NOT_FOUND}, url: /api/offers${req.url}`);
      return res.status(HttpCode.NOT_FOUND)
        .send(`Did not find offer with id: ${offerId}`);
    }

    return res.status(HttpCode.OK)
        .json(offer);
  });

  route.get(`/category/:categoryId`, routeParamsValidator, async (req, res) => {
    const {categoryId} = req.params;
    const {limit, offset} = req.query;

    const result = await offerService.findByCategory({limit, offset, categoryId});

    if (!result) {
      logger.error(`Did not find offers with category ${categoryId}`);
      return res.status(HttpCode.NOT_FOUND)
        .send(`Did not find offers with category ${categoryId}`);
    }

    return res.status(HttpCode.OK)
      .json(result);
  });

  route.post(`/`, offerValidator, async (req, res) => {
    const offer = await offerService.create(req.body);

    if (!offer) {
      logger.error(`Error status - ${HttpCode.INTERNAL_SERVER_ERROR}`);
      return res.status(HttpCode.INTERNAL_SERVER_ERROR).send(`Can not create offer`);
    }

    return res.status(HttpCode.CREATED)
      .json(offer);
  });

  route.put(`/:offerId`, [routeParamsValidator, offerValidator], async (req, res) => {
    const {offerId} = req.params;

    const isOfferUpdated = await offerService.update(offerId, req.body);

    if (!isOfferUpdated) {
      logger.error(`Error status - ${HttpCode.NOT_FOUND}, url: /api/offers${req.url}`);
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${offerId}`);
    }

    return res.status(HttpCode.OK).send(`Updated`);
  });

  route.delete(`/:offerId`, routeParamsValidator, async (req, res) => {
    const {offerId} = req.params;
    const {userId} = req.body;

    const isOfferDeleted = await offerService.drop(offerId, userId);

    if (!isOfferDeleted) {
      logger.error(`Error status - ${HttpCode.INTERNAL_SERVER_ERROR}`);
      return res.status(HttpCode.INTERNAL_SERVER_ERROR).send(`Can not delete offer`);
    }

    return res.status(HttpCode.OK).send(`Deleted!`);
  });

  route.get(`/:offerId/comments`, [routeParamsValidator, offerExist(offerService)], async (req, res) => {
    const {offerId} = req.params;
    const comments = await commentService.findAll(offerId);

    res.status(HttpCode.OK)
      .json(comments);
  });

  route.delete(`/comments/:commentId`, [routeParamsValidator, commentExist(commentService)], async (req, res) => {
    const {commentId} = req.params;
    const isCommentDeleted = await commentService.drop(commentId);

    if (!isCommentDeleted) {
      logger.error(`Error status - ${HttpCode.NOT_FOUND}`);
      return res.status(HttpCode.NOT_FOUND)
        .send(`Comment not found`);
    }

    return res.status(HttpCode.OK).send(`Deleted!`);
  });

  route.post(`/:offerId/comments`, [routeParamsValidator, offerExist(offerService), commentValidator], async (req, res) => {
    const {offerId} = req.params;
    const comment = await commentService.create(offerId, req.body);

    if (!comment) {
      logger.error(`Error status - ${HttpCode.INTERNAL_SERVER_ERROR}`);
      return res.status(HttpCode.INTERNAL_SERVER_ERROR).send(`Can not create comment`);
    }

    return res.status(HttpCode.CREATED)
      .json(comment);
  });
};
