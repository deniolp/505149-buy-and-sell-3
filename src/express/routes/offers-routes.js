'use strict';

const {Router} = require(`express`);
const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);

const {getLogger} = require(`../../service/lib/logger`);
const {ensureArray} = require(`../../utils`);
const {MAX_FILE_SIZE, ALLOWED_TYPES, MULTER_ERRORS} = require(`../../constants`);

const UPLOAD_DIR = `../upload/img/`;

const api = require(`../api`).getAPI();
const offersRouter = new Router();
const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const logger = getLogger({
  name: `offers-routes`,
});

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
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

offersRouter.get(`/add`, async (req, res) => {
  const {error} = req.query;
  const categories = await api.getCategories(false);
  res.render(`new-offer`, {categories, error});
});

offersRouter.post(`/add`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;
  const offerData = {
    picture: file.filename,
    sum: body.sum,
    type: body.action,
    description: body.description,
    title: body[`title`],
    categories: ensureArray(body.categories),
    // TODO: временно
    userId: 2
  };

  try {
    await api.createOffer(offerData);
    res.redirect(`/my`);
  } catch (err) {
    logger.error(err);
    res.redirect(`/offers/add?error=${encodeURIComponent(err.response.data)}`);
  }
});

offersRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const {error} = req.query;
  try {
    const offer = await api.getOffer(id, true);
    res.render(`offer`, {offer, id, error});
  } catch (err) {
    res.status(err.response.status).render(`errors/404`, {title: `Страница не найдена`});
  }
});

offersRouter.get(`/category/:id`, (req, res) => res.render(`category`, {}));

offersRouter.get(`/edit/:id`, async (req, res) => {
  const {error} = req.query;
  const {id} = req.params;
  try {
    const [offer, categories] = await Promise.all([
      api.getOffer(id),
      api.getCategories(true)
    ]);

    res.render(`offer-edit`, {offer, categories, id, error});
  } catch (err) {
    res.status(err.response.status).render(`errors/404`, {title: `Страница не найдена`});
  }
});

offersRouter.post(`/edit/:id`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;
  const {id} = req.params;
  const offerData = {
    picture: file ? file.filename : body[`old-image`],
    sum: body.sum,
    type: body.action,
    description: body.description,
    title: body[`title`],
    categories: ensureArray(body.categories),
    // TODO: временно
    userId: 1
  };
  try {
    await api.updateOffer(id, offerData);
    res.redirect(`/my`);
  } catch (err) {
    logger.error(err);
    res.redirect(`/offers/add?error=${encodeURIComponent(err.response.data)}`);
  }
});

offersRouter.post(`/:id/comments`, upload.single(`text`), async (req, res) => {
  const {id} = req.params;
  const {text} = req.body;

  // TODO: временно
  let comment = {};
  comment.userId = 1;
  comment.text = text;

  try {
    await api.createComment(id, comment);
    res.redirect(`/offers/${id}`);
  } catch (error) {
    res.redirect(`/offers/${id}?error=${encodeURIComponent(error.response.data)}`);
  }
});

module.exports = offersRouter;
