'use strict';

const {Router} = require(`express`);

const {getLogger} = require(`../../service/lib/logger`);
const {ensureArray} = require(`../../utils`);
const upload = require(`../middleware/upload`);
const {OFFERS_PER_PAGE} = require(`../../constants`);

const api = require(`../api`).getAPI();
const offersRouter = new Router();

const logger = getLogger({
  name: `offers-routes`,
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
    logger.error(err.message);
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

offersRouter.get(`/category/:id`, async (req, res) => {
  const {id} = req.params;
  let {page = 1} = req.query;
  page = +page;

  const limit = OFFERS_PER_PAGE;
  const offset = (page - 1) * OFFERS_PER_PAGE;

  const [{count, offers}, categories] = await Promise.all([
    api.getOffersByCategory({limit, offset, id}),
    api.getCategories(true)
  ]);

  const totalPages = Math.ceil(count / OFFERS_PER_PAGE);
  const category = categories.find((it) => it.id === +id);

  res.render(`category`, {
    categories,
    category,
    offers,
    id,
    page,
    totalPages
  });
});

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
    logger.error(err.message);
    res.redirect(`/offers/edit/${id}?error=${encodeURIComponent(err.response.data)}`);
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
    logger.error(error.message);
    res.redirect(`/offers/${id}?error=${encodeURIComponent(error.response.data)}`);
  }
});

module.exports = offersRouter;
