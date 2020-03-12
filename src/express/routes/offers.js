'use strict';

const {Router} = require(`express`);
const offersRouter = new Router();

offersRouter.get(`/add`, (req, res) => res.send(`/offers/add`));
offersRouter.get(`/category`, (req, res) => res.render(`category`, {}));
offersRouter.get(`/:id`, (req, res) => res.send(`/offers/:id ${req.params.id}`));
offersRouter.get(`/edit/:id`, (req, res) => res.send(`/offers/edit/:id ${req.params.id}`));

module.exports = offersRouter;
