'use strict';

const {nanoid} = require(`nanoid`);

const {MAX_ID_LENGTH} = require(`../../constants`);

class CommentService {
  constructor(db, logger) {
    this._models = db.models;
    this._logger = logger;
  }

  create(offer, comment) {
    const newComment = Object.assign({
      id: nanoid(MAX_ID_LENGTH),
    }, comment);

    offer.comments.push(newComment);
    return comment;
  }

  delete(offer, commentId) {
    const commentToDelete = offer.comments
      .find((item) => item.id === commentId);

    if (!commentToDelete) {
      return null;
    }

    offer.comments = offer.comments
      .filter((item) => item.id !== commentId);

    return commentToDelete;
  }

  async findAll(id) {
    const {Offer} = this._models;

    try {
      const offer = await Offer.findByPk(id);
      return await offer.getComments({raw: true});
    } catch (error) {
      this._logger.error(`Can not find offer. Error: ${error}`);

      return null;
    }
  }

}

module.exports = CommentService;
