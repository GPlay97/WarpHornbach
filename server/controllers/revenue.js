const db = require('../utils/db');
const errors = require('../errors.json');
const usersUtils = require('../utils/users');

const getRevenue = async (req, res, next) => {
    db.query('SELECT * FROM revenue')
        .then((results) => res.json(results[0]))
        .catch((err) => next(err));
};

const updateRevenue = async (req, res, next) => {
    const user = await usersUtils.getUser(req.session.username);

    if (!user.administrator) return next(errors.FORBIDDEN);
    const revenueObj = {
        salary: parseInt(req.body.salary),
        factor: parseFloat(req.body.factor),
        profit: parseInt(req.body.profit)
    };
    if (!Object.values(revenueObj).every((value) => value && value > 0)) return next(errors.UNPROCESSABLE_ENTITY);
    try {
        res.json(await db.query('UPDATE revenue SET ?', revenueObj));
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getRevenue,
    updateRevenue
};
