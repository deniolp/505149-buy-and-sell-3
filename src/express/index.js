'use strict';

const express = require(`express`);

const myRoutes = require(`./routes/my`);
const offersRoutes = require(`./routes/offers`);

const app = express();
const port = 8080;
app.listen(port);

app.use(`/my`, myRoutes);
app.use(`/offers`, offersRoutes);

app.get(`/`, (req, res) => res.send(`/`));
app.get(`/register`, (req, res) => res.send(`/register`));
app.get(`/login`, (req, res) => res.send(`/login`));
app.get(`/search`, (req, res) => res.send(`/search`));
