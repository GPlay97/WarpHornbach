const db = require('../utils/db');

const getStats = async (req, res, next) => {
    db.query('SELECT COUNT(*) as personal, (SELECT COUNT(*) FROM activity) as total FROM activity WHERE username = ?', [req.session.username])
        .then((result) => res.json(result[0]))
        .catch((err) => next(err));
};

module.exports = {
    getStats
};