/* globals __dirname */

const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const { flash } = require('express-flash-message');
const bodyParser = require('body-parser');

const configApp = (app, config) => {
    app.use(morgan('dev'));
    app.use(cookieParser());
    app.use(session({
        secret: config.cookie.secret,
        maxAge: config.cookie.expirationTime,
        store: new MySQLStore(config.mysqlConfig),
        resave: false,
        saveUninitialized: true
    }));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use('/libs', express.static(path
        .join(__dirname, '../../node_modules')));
    app.use('/public', express.static(path
        .join(__dirname, '../../public')));
    app.use(flash());
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'hbs');
};

module.exports = configApp;
