'use strict';

const express = require(`express`);
const path = require(`path`);

const myRoutes = require(`./routes/my`);
const offersRoutes = require(`./routes/offers`);

const app = express();
const port = 8080;
app.listen(port);

app.use(express.static(path.join(__dirname, `files`)));

app.set(`views`, path.join(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.use(`/my`, myRoutes);
app.use(`/offers`, offersRoutes);

app.get(`/`, (req, res) => res.render(`main`, {}));
app.get(`/register`, (req, res) => res.render(`sign-up`, {}));
app.get(`/login`, (req, res) => res.render(`login`, {}));
app.get(`/search`, (req, res) => res.render(`search-result`, {}));
app.get(`/500`, (req, res) => res.render(`errors/500`));

app.use((req, res) => {
  res.status(404).render(`errors/404`);
});
