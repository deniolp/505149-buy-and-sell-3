'use strict';

const express = require(`express`);
const path = require(`path`);

const myRoutes = require(`./routes/my`);
const offersRoutes = require(`./routes/offers`);
const getOffers = require(`./api/offers`);
const getCategories = require(`./api/categories`);
const {getSortedByCommentAmount} = require(`../utils`);

const app = express();
const port = 8080;
app.listen(port);

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
app.get(`/search`, (req, res) => res.render(`search-result`, {}));

app.use((req, res) => {
  res.status(404).render(`errors/404`, {title: `Страница не найдена`});
});

app.use((err, req, res, _next) => {
  res.status(err.status || 500);
  res.render(`errors/500`, {title: `Ошибка сервера`});
});
