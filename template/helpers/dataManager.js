const sql = require('mssql');

class DataManager {
    constructor() {
        this.config = {
            user: 'YourUser',
            password: "YourPassword",
            server: 'YourURLPassword',
            database: 'YourDatabase',
            pool: {
                max: 10,
                min: 0,
                idleTimeoutMillis: 30000
            }
        };
    }

    getTable() {
        const table = new sql.Table('survey'); // or temporary table, e.g. #temptable

        table.columns.add('language', sql.VarChar(10), { nullable: true });
        table.columns.add('simpleQuestion', sql.Int, { nullable: true });
        table.columns.add('complexQuestion', sql.NVarChar(sql.MAX), { nullable: true });
        table.columns.add('environment', sql.VarChar(50), { nullable: true });

        return table;
    }

    getConnection() {
        return sql.connect(
            "YourSqlServerStringConnection"
        );
    }

    initTable() {
        return this.getConnection().then((pool) => {
            const table = this.getTable();
            table.create = true;
            const request = new sql.Request(pool);
            request.bulk(table, (err, result) => {
                console.log(JSON.stringify(err));
                console.log(JSON.stringify(result));
            });
        });
    }

    storeData(answers) {
        const table = this.getTable();
        table.rows.add(
            answers.language,
            answers.simpleQuestion,
            answers.complexQuestion,
            
            process.env.NODE_ENV
        );
        table.create = true;

        return this.getConnection().then((pool) => {
            const request = new sql.Request(pool);
            request.bulk(table, (err, result) => {
                console.log(JSON.stringify(err));
                console.log(JSON.stringify(result));
            });
        });
    }
}

module.exports.DataManager = DataManager;
