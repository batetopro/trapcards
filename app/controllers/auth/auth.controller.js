class AuthController {
    constructor(data, trustedAdminIps) {
        this._data = data;
        this._trustedAdminIps = trustedAdminIps;
    }

    login(req, res) {
        res.render('admin/login', { loggedUser: req.user, page: 'login' });
    }
    
    verifyLoggedAdmin(req, res, next) 
    {
        // verify ip address
        const requestIP = req.connection.remoteAddress;
        if(this._trustedAdminIps.indexOf(requestIP) < 0 || !req.user) {
            const msg = 'Тази странца е само за администратори.';
            const error = { message: msg, code: 401 };
            return next(new Error(JSON.stringify(error)));
        }
        return next();
    }
}

module.exports = AuthController;
