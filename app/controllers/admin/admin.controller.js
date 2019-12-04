class AdminController {
    constructor(data) {
        this._data = data;
    }

    stamps(req, res) {
        res.render('admin/stamps', { title: 'Талони' });
    }
}

module.exports = AdminController;