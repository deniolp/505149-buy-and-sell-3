'use strict';

const {Router} = require(`express`);

const {HttpCode} = require(`../../constants`);
const offerValidator = require(`../middlewares/offer-validator`);
const commentValidator = require(`../middlewares/comment-validator`);
const offerExist = require(`../middlewares/offer-exist`);
const {getLogger} = require(`../lib/logger`);

const route = new Router();
const logger = getLogger();

module.exports = (app, offerService, commentService) => {
  app.use(`/offers`, route);

  route.get(`/`, (req, res) => {
    const offers = offerService.findAll();

    return res.status(HttpCode.OK)
        .json(offers);
  });

  route.get(`/:offerId`, (req, res) => {
    const {offerId} = req.params;
    const offer = offerService.findOne(offerId);

    if (!offer) {
      logger.error(`Error status - ${HttpCode.NOT_FOUND}, url: /api/offers${req.url}`);
      return res.status(HttpCode.NOT_FOUND)
        .send(`Did not find offer with id: ${offerId}`);
    }

    return res.status(HttpCode.OK)
        .json(offer);
  });

  route.post(`/`, offerValidator, (req, res) => {
    const offer = offerService.create(req.body);

    return res.status(HttpCode.CREATED)
      .json(offer);
  });

  route.put(`/:offerId`, offerValidator, (req, res) => {
    const {offerId} = req.params;
    const offer = offerService.findOne(offerId);

    if (!offer) {
      logger.error(`Error status - ${HttpCode.NOT_FOUND}, url: /api/offers${req.url}`);
      return res.status(HttpCode.NOT_FOUND)
        .send(`Did not find offer with id: ${offerId}`);
    }

    const updatedOffer = offerService.update(offerId, req.body);

    return res.status(HttpCode.OK)
      .json(updatedOffer);
  });

  route.delete(`/:offerId`, (req, res) => {
    const {offerId} = req.params;
    const offer = offerService.delete(offerId);

    if (!offer) {
      logger.error(`Error status - ${HttpCode.NOT_FOUND}, url: /api/offers${req.url}`);
      return res.status(HttpCode.NOT_FOUND)
        .send(`Did not find offer with id: ${offerId}`);
    }

    return res.status(HttpCode.OK)
      .json(offer);
  });

  route.get(`/:offerId/comments`, offerExist(offerService), (req, res) => {
    const {offer} = res.locals;

    const comments = commentService.findAll(offer);

    return res.status(HttpCode.OK)
      .json(comments);
  });

  route.delete(`/:offerId/comments/:commentId`, offerExist(offerService), (req, res) => {
    const {offer} = res.locals;
    const {commentId} = req.params;
    const deletedComment = commentService.delete(offer, commentId);

    if (!deletedComment) {
      logger.error(`Error status - ${HttpCode.NOT_FOUND}, url: /api/offers${req.url}`);
      return res.status(HttpCode.NOT_FOUND)
        .send(`Did not find comment with id: ${commentId}`);
    }

    return res.status(HttpCode.OK)
      .json(deletedComment);
  });

  route.post(`/:offerId/comments`, [offerExist(offerService), commentValidator], (req, res) => {
    const {offer} = res.locals;
    const comment = commentService.create(offer, req.body);

    return res.status(HttpCode.CREATED)
      .json(comment);
  });
};
