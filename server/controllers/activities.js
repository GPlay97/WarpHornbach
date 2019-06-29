const db = require('../utils/db');
const usersUtils = require('../utils/users');

const postActivity = async (req, res, next) => {
    db.query('INSERT INTO activity SET ?', {
        username: req.session.username,
        activity_time: parseInt(new Date() / 1000)
    }).then((result) => {
        res.json({
            id: result.insertId
        });
    }).catch((err) => next(err));
};

const getActivities = async (req, res, next) => {
    const user = await usersUtils.getUser(req.session.username);
    let userFilter = '';
    let userValues = [];

    if (!user.administrator) {
        userFilter += 'WHERE username = ?';
        userValues.push(req.session.username);
    }

    db.query(`SELECT * FROM activity ${userFilter} ORDER BY activity_time DESC`, userValues)
        .then((results) => res.json(results))
        .catch((err) => next(err));
};

module.exports = {
    postActivity,
    getActivities
};

