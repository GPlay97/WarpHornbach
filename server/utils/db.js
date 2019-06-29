const mysql = require('mysql');
const config = require('../config.json');
const errors = require('../errors.json');
const db = mysql.createPool({
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_NAME
});

module.exports = {
    /**
     * Queries the database for given sql string and parameters
     * It automatically escapes the sql string through binding with given parameters
     * @example db.query('SELECT id FROM foo WHERE bar=?', ['foobar'], (err, queryRes) => console.log(err, queryRes));
     * @param {String} sql the sql string
     * @param {Array} params Array of values to bind to parameters ('?' within sql string)
     */
    query: async (sql, params) => {
        return new Promise((resolve, reject) => {
            if (!Array.isArray(params) && (typeof params !== 'object' || params == null)) params = [];
            if (typeof sql !== 'string') return reject(errors.UNPROCESSABLE_ENTITY);
            db.query(mysql.format(sql, params), (err, queryRes) => {
                if (err) return reject(errors.DB_QUERY);
                resolve(queryRes);
            });
        });
    }
};