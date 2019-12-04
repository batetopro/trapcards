const passport = require('passport');
const { Strategy } = require('passport-local');


const configAuth = (app, data) => {

    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new Strategy(
        (username, password, done) => {
            Promise.resolve()
                .then(() => {
                    return data.admins.verifyAdmin(username, password);
                })
                .then((admin) => {
                    if (admin) {
                        return admin;
                    } else {
                        throw('Invalid user');
                    }
                })
                .then((user) => {
                    done(null, user);
                })
                .catch(() => {
                    done(null, false,
                        { message: 'Invalid login credentials!' });
                });
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((loggedUser, done) => {
        done(null, loggedUser);
    });
};

module.exports = configAuth;
