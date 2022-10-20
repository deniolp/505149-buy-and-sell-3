'use strict';

const {HttpCode} = require(`../../constants`);
const {getLogger} = require(`../lib/logger`);

const logger = getLogger({
  name: `api-server-mdwr-comment-exist`,
});

module.exports = (service) => async (req, res, next) => {
  const {commentId} = req.params;
  const comment = await service.findOne(commentId);

  if (!comment) {
    logger.error(`Error status - ${HttpCode.NOT_FOUND}, url: ${req.url}`);
    return res.status(HttpCode.NOT_FOUND)
      .send(`Comment with id ${commentId} not found`);
  }

  res.locals.comment = comment;
  return next();
};
