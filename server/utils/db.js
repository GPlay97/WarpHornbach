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
     * @param {Function} callback callback function
     */
    query: (sql, params, callback) => {
        if (typeof params === 'function') callback = params;
        if (!Array.isArray(params)) params = [];
        if (typeof sql === 'string') {
            db.query(mysql.format(sql, params), (err, queryRes) => {
                if (typeof callback === 'function') callback(err, queryRes);
            });
        } else if (typeof callback === 'function') callback(errors.UNPROCESSABLE_ENTITY);
    }
};