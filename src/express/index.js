'use strict';

const express = require(`express`);
const path = require(`path`);

const myRoutes = require(`./routes/my`);
const offersRoutes = require(`./routes/offers`);
const getOffers = require(`./api/offers`);
const getCategories = require(`./api/categories`);
const getSearchResults = require(`./api/search`);
const {getSortedByCommentAmount} = require(`../utils`);
const {getLogger} = require(`../service/lib/logger`);

const logger = getLogger();

const app = express();
const port = 8080;
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, `files`)));

app.set(`views`, path.join(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.use(`/my`, myRoutes);
app.use(`/offers`, offersRoutes);

app.get(`/`, async (req, res) => {
  const offers = await getOffers();
  const categories = await getCategories();

  res.render(`main`, {
    offers,
    mostDiscussed: getSortedByCommentAmount(offers),
    categories,
  });
});
app.get(`/register`, (req, res) => res.render(`sign-up`, {}));
app.get(`/login`, (req, res) => res.render(`login`, {}));
app.get(`/search`, async (req, res) => {
  const encodedURI = encodeURI(req.query.search);
  const offers = await getSearchResults(encodedURI);
  const allOffers = await getOffers();
  const eightOffers = allOffers.slice(0, 8);
  const moreOffersQty = allOffers.length >= 8 ? (allOffers.length) - 8 : null;

  res.render(`search-result`, {offers, eightOffers, moreOffersQty});
});

app.use((req, res) => {
  logger.error(`Error status - 404, url: ${req.url}`);
  res.status(404).render(`errors/404`, {title: `Страница не найдена`});
});

app.use((err, req, res, _next) => {
  logger.error(`Error status - ${err.status || 500}`);
  res.status(err.status || 500);
  res.render(`errors/500`, {title: `Ошибка сервера`});
});

app.listen(port, (err) => {
  if (err) {
    return logger.error(`Ошибка при создании сервера: ${err}`);
  }

  return logger.info(`Ожидаю соединений на ${port} порт`);
});
