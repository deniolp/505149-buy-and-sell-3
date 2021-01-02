'use strict';

class CommentService {
  constructor(db, logger) {
    this._models = db.models;
    this._logger = logger;
  }

  async create(id, comment) {
    const {Offer, Comment} = this._models;

    const offer = await Offer.findByPk(id);
    const newComment = await offer.createComment({
      text: comment.text,
      [`user_id`]: 1,
    });

    return await Comment.findByPk(newComment.id, {raw: true});
  }

  async delete(commentId) {
    const {Comment} = this._models;

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
  }

  async findAll(id) {
    const {Offer} = this._models;

    const offer = await Offer.findByPk(id);
    return await offer.getComments({raw: true});
  }

}

module.exports = CommentService;
