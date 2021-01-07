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

      return await Comment.findByPk(newComment.id, {raw: true});
    } catch (error) {
      this._logger.error(`Can not create comment for offer with ${id}. Error: ${error}`);

      return null;
    }
  }

  async delete(commentId) {
    const {Comment} = this._models;

    try {
      const commentForDelete = await Comment.findByPk(commentId, {raw: true});
      const deletedRows = await Comment.destroy({
        where: {
          id: commentId,
        }
      });

      if (!deletedRows) {
        return null;
      }

      return commentForDelete;
    } catch (error) {
      this._logger.error(`Can not delete comment. Error: ${error}`);

      return null;
    }
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
