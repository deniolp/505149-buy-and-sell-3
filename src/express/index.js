'use strict';

const express = require(`express`);
const path = require(`path`);

const myRoutes = require(`./routes/my-routes`);
const offersRoutes = require(`./routes/offers-routes`);
const mainRoutes = require(`./routes/main-routes`);
const {getLogger} = require(`../service/lib/logger`);
const {APP_PORT} = require(`../../config`);

const PUBLIC_DIR = `files`;
const UPLOAD_DIR = `upload`;

const logger = getLogger({
  name: `front-server`,
});

const app = express();
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, PUBLIC_DIR)));
app.use(express.static(path.join(__dirname, UPLOAD_DIR)));

app.set(`views`, path.join(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.use(`/`, mainRoutes);
app.use(`/my`, myRoutes);
app.use(`/offers`, offersRoutes);

app.use((req, res) => {
  logger.error(`Error status - 404, url: ${req.url}`);
  res.status(404).render(`errors/404`, {title: `Страница не найдена`});
});

app.use((err, req, res, _next) => {
  logger.error(`Error status - ${err.status || 500}, ${err}`);
  res.status(err.status || 500);
  res.render(`errors/500`, {title: `Ошибка сервера`});
});

app.listen(APP_PORT, (err) => {
  if (err) {
    return logger.error(`Ошибка при создании сервера: ${err}`);
  }

  return logger.info(`Ожидаю соединений на ${APP_PORT} порт`);
});
