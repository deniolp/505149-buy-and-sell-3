'use strict';

const {getLogger} = require(`../lib/logger`);
const Aliase = require(`../models/aliases`);

const logger = getLogger({
  name: `data-service-comments`,
});

class CommentService {
  constructor(sequelize) {
    this._Offer = sequelize.models.offer;
    this._Comment = sequelize.models.comment;
    this._User = sequelize.models.user;
  }

  async create(offerId, comment) {
    try {
      const newComment = await this._Comment.create({
        offerId,
        ...comment
      });

      return newComment;
    } catch (error) {
      logger.error(`Can not create comment for offer with ${offerId}. Error: ${error}`);

      return null;
    }
  }

  async drop(id) {
    try {
      const deletedRow = await this._Comment.destroy({
        where: {id}
      });
      return !!deletedRow;
    } catch (error) {
      logger.error(`Can not delete comment. Error: ${error}`);

      return null;
    }
  }

  async findOne(id) {
    try {
      return await this._Comment.findOne({
        where: {id}
      });
    } catch (error) {
      logger.error(`Can not find comment with ${id}. Error: ${error}`);

      return null;
    }
  }

  async findAll(offerId) {
    try {
      return await this._Comment.findAll({
        where: {offerId},
        include: {
          model: this._User,
          as: Aliase.USERS,
          attributes: {
            exclude: [`passwordHash`]
          }
        },
      });
    } catch (error) {
      logger.error(`Can not find comments of offer with id ${offerId}. Error: ${error}`);

      return null;
    }
  }

}

module.exports = CommentService;
