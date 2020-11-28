'use strict';

class CommentService {
  constructor(db, logger) {
    this._models = db.models;
    this._logger = logger;
  }

  async create(id, comment) {
    const {Offer, Comment} = this._models;

    try {
      const offer = await Offer.findByPk(id);
      const newComment = await offer.createComment({
        text: comment.text,
        [`user_id`]: 1,
      });
      console.log(newComment);

      return await Comment.findByPk(newComment.id, {raw: true});
    } catch (error) {
      this._logger.error(`Can not create comment for offer with ${id}. Error: ${error}`);

      return null;
    }
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
      this._logger.error(`Can not find comments of offer with id ${id}. Error: ${error}`);

      return null;
    }
  }

}

module.exports = CommentService;
