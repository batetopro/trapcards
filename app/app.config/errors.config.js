const configApp = (app, controllerFactory) => {
    const controller = controllerFactory.getErrorController();

    app.use((err, req, res, next) => {
        return controller.handleError(err, req, res, next);
    });
};

module.exports = configApp;
