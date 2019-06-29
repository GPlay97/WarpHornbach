const bcrypt = require('bcrypt');
const db = require('../utils/db');
const usersUtils = require('../utils/users');
const errors = require('../errors.json'); 

const register = async (req, res, next) => {
    if (typeof req.body.password !== 'string' || req.body.password.length < 6) return next(errors.PASSWORD_TOO_SHORT);
    if (await usersUtils.getUser(req.params.username)) return next(errors.USER_ALREADY_REGISTERED);
    db.query('INSERT INTO user SET ?', {
        username: req.params.username,
        pwd_hash: bcrypt.hashSync(req.body.password, 10)
    }).then(() => {
        req.session.username = req.params.username;
        res.json({
            id: req.session.id
        });
    }).catch((err) => next(err));
};

const login = async (req, res, next) => {
    if (typeof req.body.password !== 'string' || req.body.password.length < 6) return next(errors.PASSWORD_TOO_SHORT);
    const user = await usersUtils.getUser(req.params.username);

    if (!user) return next(errors.USER_NOT_FOUND);
    if (!bcrypt.compareSync(req.body.password, user.pwd_hash)) return next(errors.INVALID_CREDENTIALS);
    req.session.username = req.params.username;
    res.json({
        id: req.session.id
    });
};

module.exports = {
    register,
    login
};