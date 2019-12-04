const BaseData = require('./base/base.data');
const Stamp = require('../models/stamp.model');

class StampsData extends BaseData {
    async getByCode(code) {
        const selectColumns = [
            'code', 
            'stamp_template_id as stampTemplateId', 
            'activity_type_id as activityTypeId',
            'pic_path as picPath', 
            'points', 
            'claimed_by_number as claimedByNumber', 
            'claimed_ts as claimedTs', 
            'print_count as printCount', 
            'last_printed_ts as lastPrintedTs'
        ].join(', ');
        const whereClause = 'code = ?';
        const query = {
            sql: `select ${selectColumns} from stamps where ${whereClause}`,
            values: [ code ]

        };
        const stamps = await this._database.query(query);
        if (!Array.isArray(stamps) || !stamps.length) {
            return null;
        }
        return new Stamp(stamps[0]);
    }

    async redeemStamp(code, cardNumber) {
        let hasSucceeded = false;
        try {
            this._database.beginTransaction();
            let hasError = false;

            if (!hasError) {
                const query = {
                    sql: 'update stamps set claimed_by_number = ?, claimed_ts = now() where claimed_by_number is null and code = ?',
                    values: [ cardNumber, code ]
                };
                const result = await this._database.query(query);
                if (result.affectedRows != 1) {
                    hasError = true;
                }
            }

            if (!hasError) {
                const query = {
                    sql: 'update cards set balance = balance + (select points from stamps where code = ?) where number = ?',
                    values: [ code, cardNumber ]
                };
                const result = await this._database.query(query);
                if (result.affectedRows != 1) {
                    hasError = true;
                }
            }

            if (hasError) {
                this._database.rollbackTransaction();
                hasSucceeded = false;
            } else {
                await this._database.commitTransaction();
                hasSucceeded = true;
            }            
        } catch(err) {
            this._database.rollbackTransaction();
            throw err;
        }

        return hasSucceeded;
    }
}

module.exports = StampsData;
