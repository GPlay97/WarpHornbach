const db = require('./db');
const getUser = async (username) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM user WHERE username=?', [username]).then((result) => resolve(result[0])).catch(reject);
    });
};

module.exports = {
    getUser
};