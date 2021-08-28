'use strict';

const path = require(`path`);

module.exports.DEFAULT_COMMAND = `--help`;
module.exports.MAX_DATA_COUNT = 1000;
module.exports.USER_ARGV_INDEX = 2;
module.exports.MAX_ID_LENGTH = 6;
module.exports.MAX_COMMENTS = 4;
module.exports.DEFAULT_COUNT = 10;
module.exports.TXT_FILES_DIR = `./data/`;
module.exports.FILE_NAME = `mocks.json`;
module.exports.PUBLIC_DIR = `files`;
module.exports.UPLOAD_DIR = `upload`;
module.exports.MULTER_UPLOAD_DIR = path.resolve(__dirname, `express/upload/img/`);
module.exports.TIMEOUT = 1000;
module.exports.OFFERS_PER_PAGE = 8;
module.exports.SALT_ROUNDS = 10;
module.exports.MAX_FILE_SIZE = 2 * 1024 * 1024;
module.exports.ALLOWED_TYPES = [`image/jpeg`, `image/png`, `image/jpg`];

module.exports.MULTER_ERRORS = {
  FILE_TOO_LARGE: `File too large`,
  NOT_IMAGE: `The file is not an image!`
};

module.exports.RegisterMessage = {
  USER_ALREADY_REGISTER: `User with such email already exists`,
  WRONG_NAME: `Field "name" contains invalid characters`,
  REQUIRED_FIELD: `Field is required to be filled`,
  MIN_PASSWORD_LENGTH: `Password has to be at least 6 characters`,
  PASSWORDS_NOT_EQUALS: `Passwords do not match`,
  EMPTY_VALUE: `Empty value is not permitted`,
  EMPTY_VALUE_IMAGE: `No "image" received or invalid file type`,
  WRONG_EMAIL: `Email is incorrect`,
  WRONG_PASSWORD: `Password is incorrect`,
};

module.exports.ExitCode = {
  error: 1,
  success: 0,
};

module.exports.HttpMethod = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

module.exports.HttpCode = {
  OK: 200,
  CREATED: 201,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
  BAD_REQUEST: 400,
};

module.exports.Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`,
  TEST: `test`,
};
