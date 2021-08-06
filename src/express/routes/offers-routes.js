'use strict';

const {Router} = require(`express`);
const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);

const {getLogger} = require(`../../service/lib/logger`);
const {ensureArray} = require(`../../utils`);

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

const upload = multer({storage});

offersRouter.get(`/add`, async (req, res) => {
  const categories = await api.getCategories(false);
  res.render(`new-offer`, {categories});
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
  };

  try {
    await api.createOffer(offerData);
    res.redirect(`/my`);
  } catch (err) {
    logger.error(err);
    res.redirect(`back`);
  }
});

offersRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const offer = await api.getOffer(id, true);
  res.render(`offer`, {offer});
});

offersRouter.get(`/category/:id`, (req, res) => res.render(`category`, {}));

offersRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const [offer, categories] = await Promise.all([
    api.getOffer(id),
    api.getCategories(true)
  ]);

  res.render(`offer-edit`, {offer, categories, id});
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
  };
  try {
    await api.updateOffer(id, offerData);
    res.redirect(`/my`);
  } catch (err) {
    logger.error(err);
    res.redirect(`back`);
  }
});

module.exports = offersRouter;
