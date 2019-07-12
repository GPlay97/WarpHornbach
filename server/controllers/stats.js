const db = require('../utils/db');

const getStats = async (req, res, next) => {
    const sevenDaysAgo = parseInt(new Date() / 1000 - 86400 * 7);

    db.query('SELECT COUNT(*) as personal, (SELECT COUNT(*) FROM activity WHERE activity_time >= ?) as total FROM activity WHERE username = ? AND activity_time >= ?', [
        sevenDaysAgo, req.session.username, sevenDaysAgo
    ])
        .then((result) => res.json(result[0]))
        .catch((err) => next(err));
};

module.exports = {
    getStats
};