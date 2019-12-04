var express = require('express');
var router = express.Router();

const attach = (app, controllersFactory) => {
  const cardsController = controllersFactory.getCardsController();

  router.route('/check', ).get((req, res) => cardsController.cardCheck(req, res));
  router.route('/add', ).get((req, res) => cardsController.redeemStamp(req, res));
  router.route('/add', ).post((req, res) => cardsController.redeemStamp(req, res));
  router.route('/register', ).get((req, res) => cardsController.register(req, res));
  router.route('/register', ).post((req, res) => cardsController.register(req, res));

  router.route('/', ).get((req, res) => res.redirect(301, '/add'))

  app.use('/', router);
}

module.exports = attach;
