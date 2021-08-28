'use strict';

const multer = require(`multer`);
const {nanoid} = require(`nanoid`);
const {MAX_FILE_SIZE, ALLOWED_TYPES, MULTER_ERRORS, MULTER_UPLOAD_DIR} = require(`../../constants`);

const storage = multer.diskStorage({
  destination: MULTER_UPLOAD_DIR,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});

const upload = multer({
  storage,
  limits: {fileSize: MAX_FILE_SIZE},
  fileFilter: (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(MULTER_ERRORS.NOT_IMAGE), false);
    }
  }
});

module.exports = upload;
