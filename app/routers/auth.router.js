const { Router } = require('express');
const router = new Router();
const passport = require('passport');

const attach = (app, controllerFactory) => {
    const controller = controllerFactory.getAuthController();

    router.route('/admin/login')
        .get((req, res) => {
            controller.login(req, res);
        })
        .post(passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true,
        }));

    router.route('/admin/logout')
        .get((req, res) => {
            req.logout();
            res.redirect('/admin/login');
        });

    app.use('/', router);
};

module.exports = attach;
