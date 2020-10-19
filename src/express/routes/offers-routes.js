'use strict';

const {Router} = require(`express`);
const formidable = require(`formidable`);
const {getLogger} = require(`../../service/lib/logger`);

const api = require(`../api`).getAPI();

const offersRouter = new Router();

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
  let offer = {category: []};

  const formData = new formidable.IncomingForm({maxFileSize: 2 * 1024 * 1024});
  try {
    formData.parse(req)
      .on(`field`, (name, field) => {
        if (name === `category`) {
          offer[name].push(field);
        } else {
          offer[name] = field;
        }
      })
      .on(`fileBegin`, (name, file) => {
        if (!allowedTypes.includes(file.type)) {
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
        formData.emit(`error`, `Request aborted by the user.`);
      })
      .on(`error`, (err) => {
        logger.error(`There is error while parsing form data. ${err}`);
        res.render(`new-offer`, {categories, offer});
      })
      .on(`end`, async () => {
        if (isAllowedFormat) {
          await api.createOffer(offer);
          res.redirect(`/my`);
        } else {
          formData.emit(`error`, `Not correct file's extension.`);
        }
      });
  } catch (error) {
    logger.error(`Error happened: ${error}`);
    res.render(`new-offer`, {categories, offer});
  }
});

offersRouter.get(`/category/:id`, (req, res) => res.render(`category`, {}));
offersRouter.get(`/:id`, (req, res) => res.render(`offer`, {}));
offersRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const [offer, categories] = await Promise.all([api.getOffer(id), api.getCategories()
  ]);

  if (offer) {
    res.render(`offer-edit`, {offer, categories, id});
  } else {
    res.status(404).render(`errors/404`, {title: `Страница не найдена`});
  }
});

module.exports = offersRouter;
