'use strict';

const {Router} = require(`express`);
const formidable = require(`formidable`);
const {getLogger} = require(`../../service/lib/logger`);

const getOffers = require(`../api/offers`);
const getCategories = require(`../api/categories`);
const postOffer = require(`../api/new-offer`);

const offersRouter = new Router();

const logger = getLogger();

let categories = [];
let isAllowedFormat;

offersRouter.get(`/add`, async (req, res) => {
  categories = await getCategories();
  res.render(`new-ticket`, {categories});
});

offersRouter.post(`/add`, async (req, res) => {
  const allowedTypes = [`image/jpeg`, `image/png`];
  let offer = {category: []};
  const formData = new formidable.IncomingForm();
  try {
    await formData.parse(req)
      .on(`field`, (name, field) => {
        if (name === `category`) {
          offer[name].push(field);
        } else {
          offer[name] = field;
        }
      })
      .on(`fileBegin`, (name, file) => {
        if (!allowedTypes.includes(file.type)) {
          logger.error(`Not correct type of file`);
          isAllowedFormat = false;
        } else {
          isAllowedFormat = true;
          file.path = process.cwd() + `/src/express/files/img/` + file.name;
        }
      })
      .on(`file`, (name, file) => {
        offer.picture = file.path.match(/\/([^\/]+)\/?$/)[1];
      })
      .on(`aborted`, () => {
        logger.error(`Request aborted by the user`);
      })
      .on(`error`, (_err) => {
        logger.error(`There is error while parsing form data`);
        res.render(`new-ticket`, {categories, offer});
      })
      .on(`end`, async () => {
        if (isAllowedFormat) {
          await postOffer(offer);
          res.redirect(`/my`);
        } else {
          res.render(`new-ticket`, {categories, offer});
        }
      });
  } catch (error) {
    logger.error(`Error happened: `, error);
  }
});

offersRouter.get(`/category`, (req, res) => res.render(`category`, {}));
offersRouter.get(`/:id`, (req, res) => res.render(`ticket`, {}));
offersRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const offers = await getOffers();
  const offer = offers.find((item) => item.id === id);

  if (offer) {
    res.render(`ticket-edit`, {
      offer,
    });
  } else {
    res.status(404).render(`errors/404`, {title: `Страница не найдена`});
  }
});

module.exports = offersRouter;
