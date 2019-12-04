class ControllerFactory {
    constructor(controllers, data, trustedAdminIps, cardNumbers, stampCodes, mailTransport) {
        this._controllers = controllers;
        this._trustedAdminIps = trustedAdminIps;
        this._data = data;
        this._cardNumbers = cardNumbers;
        this._stampCodes = stampCodes;
        this._mailTransport = mailTransport;
    }

    getErrorController() {
        return new this._controllers.ErrorController(this.logger);
    }

    getCardsController() {
        return new this._controllers.CardsController(this._data, this._cardNumbers, this._mailTransport);
    }

    getAuthController() {
        return new this._controllers.AuthController(this._data, this._trustedAdminIps);
    }

    getAdminController() {
        return new this._controllers.AdminController(this._data);
    }

}

module.exports = ControllerFactory;
