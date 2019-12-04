const start = async () => {
    const config = require('./config');
    const controllers = require('./app/controllers');
    const { CardNumbers, StampCodes } = require('./utils/number_tools');
    const { ControllerFactory } = require('./utils/factories');
    const MysqlDatabase = require('./utils/database/mysql.database');
    cardNumbers = new CardNumbers();
    stampCodes = new StampCodes();
    database = new MysqlDatabase(config.mysqlConfig);
    const data = require('./app/data').init(database);
    mailConfig = config.mailConfig;
    const mailTransport = require('./app/mail').getTransport(mailConfig);
    controllerFactory = new ControllerFactory(controllers, await data, config.trustedAdminIps, cardNumbers, stampCodes, await mailTransport);
    const app = require('./app').init(config, await data, controllerFactory);
    return (await app).listen(
        config.port,
        () => console.log(`Server started and `
            + `listending on port ${config.port}`)
    );
}

start();