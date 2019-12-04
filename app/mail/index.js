const nodemailer = require("nodemailer");
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

const getTransport = async (mailConfig) => {
    const transport = nodemailer.createTransport(mailConfig);
    const viewPath = path.join(__dirname, '../views/mail/');
    const hbOptions = {
        viewEngine : {
            extname: '.hbs', 
            layoutsDir: viewPath,
            defaultLayout: 'layout',
            partialsDir: viewPath,
        },
        viewPath: viewPath,
        extName: '.hbs'
    }
    transport.use('compile', hbs(hbOptions));
    return transport;
}

module.exports = { getTransport };
