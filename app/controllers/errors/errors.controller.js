class ErrorController {
    constructor(logger) {
        //this.logger = logger;
    }

    handleError(err, req, res, next) {
        let error;

        try {
            error = JSON.parse(err.message);
        } catch (e) {
            //this.logger.log(err.message);

            return res.send(err.message);
        }

        const message = error.message;
        const code = +error.code;

        //this.logger.log(message);

        if (code === 401) {
            return res.status(code).send(message);
        }

        if (code === 500) {
            return res.status(code).json(error);
        }

        return res.status(400).send('Some unexpected error');
    }
}

module.exports = ErrorController;
