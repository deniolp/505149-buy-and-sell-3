'use strict';

const express = require(`express`);

const {HttpCode} = require(`../../../constants`);
const routes = require(`../../api`);

const app = express();
app.use(express.json());
app.use(`/api`, routes);

app.use((req, res) => res.status(HttpCode.NOT_FOUND)
  .send(`Not found`));

module.exports = app;
