'use strict';

const {Router} = require(`express`);
const formidable = require(`formidable`);
const path = require(`path`);

const {getLogger} = require(`../../service/lib/logger`);

const UPLOAD_DIR = `../upload/img/`;

const api = require(`../api`).getAPI();
const offersRouter = new Router();
const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const logger = getLogger({
  name: `front-server-formidable`,
});

offersRouter.get(`/add`, async (req, res) => {
  const categories = await api.getCategories();
  res.render(`new-offer`, {categories});
});

offersRouter.post(`/add`, async (req, res) => {
  const categories = await api.getCategories();
  const allowedTypes = [`image/jpeg`, `image/png`];
  let isAllowedFormat;
  let offer = {categories: []};

  const formData = new formidable.IncomingForm({maxFileSize: 2 * 1024 * 1024});
  try {
    formData.parse(req)
      .on(`field`, (name, field) => {
        if (name === `category`) {
          offer.categories.push(field);
        } else {
          offer[name] = field;
        }
      })
      .on(`fileBegin`, (name, file) => {
        if (!allowedTypes.includes(file.type)) {
          isAllowedFormat = false;
        } else {
          isAllowedFormat = true;
          file.path = uploadDirAbsolute + `/` + file.name;
        }
      })
      .on(`file`, (name, file) => {
        offer.picture = file.path.match(/\/([^\/]+)\/?$/)[1];
      })
      .on(`aborted`, () => {
        formData.emit(`error`, `Request aborted by the user.`);
      })
      .on(`error`, (err) => {
        logger.error(`There is error while parsing form data. ${err}`);
        res.render(`new-offer`, {categories, offer});
      })
      .on(`end`, async () => {
        if (isAllowedFormat) {
          const result = await api.createOffer(offer);
          if (result) {
            return res.redirect(`/my`);
          }
          return formData.emit(`error`, `Did not create offer.`);
        } else {
          return formData.emit(`error`, `Not correct file's extension.`);
        }
      });
  } catch (error) {
    logger.error(`Error happened: ${error}`);
    res.render(`new-offer`, {categories, offer});
  }
});

offersRouter.get(`/category/:id`, (req, res) => res.render(`category`, {}));
offersRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  try {
    const [offer, comments] = await Promise.all([api.getOffer(id), api.getComments(id)]);
    res.render(`offer`, {offer, comments});
  } catch (error) {
    res.status(error.response.status).render(`errors/404`, {title: `Страница не найдена`});
  }
});

offersRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const [offer, categories] = await Promise.all([api.getOffer(id), api.getCategories()
  ]);
  const plainOfferCategories = offer.categories.reduce((acc, item) => {
    acc.push(item.title);
    return acc;
  }, []);

  if (offer) {
    res.render(`offer-edit`, {offer, categories, plainOfferCategories, id});
  } else {
    res.status(404).render(`errors/404`, {title: `Страница не найдена`});
  }
});

module.exports = offersRouter;
