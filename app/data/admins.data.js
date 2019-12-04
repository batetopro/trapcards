const BaseData = require('./base/base.data');

class AdminsData extends BaseData {
    async verifyAdmin(username, password) {
        const selectColumns = [
            'username'
        ].join(', ');
        const whereClause = 'username = ? and password_sha256_hash = sha2(concat(?, password_salt), 256)';
        const query = {
            sql: `select ${selectColumns} from admins where ${whereClause}`,
            values: [ username, password ]

        };
        const admins = await this._database.query(query);
        if (!Array.isArray(admins) || !admins.length) {
            return null;
        }
        return admins[0];
    }
}

module.exports = AdminsData;
