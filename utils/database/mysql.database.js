const mysql = require('mysql');

class MysqlDatabase {
    constructor(config) {
        this.connection = mysql.createConnection(config);
    }

    query(sql) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, (err, rows) => {
                if (err)
                    return reject(err);
                resolve(rows);
            });
        });
    }

    beginTransaction() {
        return new Promise((resolve, reject) => {
            this.connection.beginTransaction(function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        
    }

    commitTransaction() {
        return new Promise((resolve, reject) => {
            this.connection.commit(function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    rollbackTransaction() {
        return new Promise((resolve, reject) => {
            this.connection.rollback(function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            this.connection.end(err => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    }
}

module.exports = MysqlDatabase;