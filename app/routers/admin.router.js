const express = require('express');
const passport = require('passport');
const router = express.Router();

const attach = (app, controllersFactory) => {
  const authController = controllersFactory.getAuthController();
  const adminController = controllersFactory.getAdminController();
  

  router.route('/admin/login')
      .get((req, res) => {
          authController.login(req, res);
      })
      .post(passport.authenticate('local', {
          successRedirect: '/admin/stamps',
          failureRedirect: '/admin/login',
          failureFlash: true,
      }));

  router.route('/admin/logout')
      .get((req, res) => {
          req.logout();
          res.redirect('/admin/login');
      });

  router.route('/admin/stamps').get((req, res, next) => authController.verifyLoggedAdmin(req, res, next), (req, res) => adminController.stamps(req, res));

  app.use('/', router);
}

module.exports = attach;
