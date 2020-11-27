'use strict';

const {Model, DataTypes} = require(`sequelize`);

module.exports = {
  createCommentModel: (sequelize) => {
    class Comment extends Model {}

    Comment.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      text: {
        type: DataTypes.STRING(300), /* eslint-disable-line */
        allowNull: false,
      },
    }, {
      sequelize,
      createdAt: `created_date`,
      updatedAt: false,
      paranoid: false,
      modelName: `comment`,
    });

    return Comment;
  }
};
