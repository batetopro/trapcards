const config = {
    port: process.env.PORT || 3000,
    cookie: {
        secret: process.env.COOKIE_SECRET || 'There is no knowledge that is not power!',
        expirationTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
    mysqlConfig: {
        host: 'localhost',
        user: 'trapcards',
        password: 'trap-cards',
        database: 'trapcards'
    },
    mailConfig: {
        host: "cards.trotoara.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'cards@cards.trotoara.com',
            pass: 'password'
        }
    },
    trustedAdminIps: [
        '127.0.0.1',
        '::1'
    ]
};

module.exports = config;
