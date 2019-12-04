const BaseData = require('./base/base.data');
const Card = require('../models/card.model');

class CardsData extends BaseData {
    async getByNumber(number) {
        const selectColumns = [
            'number as number', 
            'email as email', 
            'nick as nick', 
            'first_name as firstName', 
            'last_name as lastName', 
            'pic_path as picPath', 
            'issue_date as issueDate', 
            'balance as balance', 
            'pending_deactivation_date as pendingDeactivationDate',
            'is_active as isActive'
        ].join(', ');
        const whereClause = 'number = ?';
        const query = {
            sql: `select ${selectColumns} from cards where ${whereClause}`,
            values: [ number ]

        };
        const cards = await this._database.query(query)
        if (!Array.isArray(cards) || !cards.length) {
            return null;
        }
        return new Card(cards[0]);
    }

    async addCard(card, putChecksumToCardNumber) {
        const getCardNumSeed = async () => {
            this._database.beginTransaction();
            let seed = 1000; // seeds start from 1000
            try {
                const seeds = await this._database.query('select value from seeds where name = \'card_number\'');
                const updateSeedQuery = {};
                if (!Array.isArray(seeds) || !seeds.length) {
                    updateSeedQuery.sql = 'insert into seeds (name, value) values (\'card_number\', ?)';
                } else {
                    seed = seeds[0].value;
                    updateSeedQuery.sql = 'update seeds set value = ?';
                }
                updateSeedQuery.values = [ seed + 1 ];
                await this._database.query(updateSeedQuery);
                await this._database.commitTransaction();
            } catch (err) {
                this._database.rollbackTransaction();
                throw err;
            }

            return seed;
        }

        const seed = await getCardNumSeed();
        const newCardNumber = putChecksumToCardNumber(seed * 100);

        const insertColumns = [
            'number', 
            'email', 
            'nick', 
            'first_name', 
            'last_name', 
            'pic_path',
            'issue_date', 
        ].join(', ');
        const insertValues  = [
            newCardNumber,
            card.email,
            card.nick,
            card.firstName,
            card.lastName,
            card.picPath,
            card.issueDate,
        ];
        const query = {
            sql: `insert into cards (${insertColumns}) values (?, ?, ?, ?, ?, ?, now())`,
            values: insertValues
        }
        await this._database.query(query);

        return this.getByNumber(newCardNumber);
    }

    async activateCardIfEnoughPoints(cardNumber, minPoints) {
        minPoints = Math.trunc(minPoints);

        const query = {
            sql: `update cards set is_active = 1 where number = ? and balance >= ? and is_active = 0`,
            values: [ cardNumber, minPoints ]
        }
        const result = await this._database.query(query);
        return result.affectedRows == 1;
    }
}

module.exports = CardsData;
