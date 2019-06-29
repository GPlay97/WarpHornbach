const errors = require('../errors.json');

const isAuthenticated = (req, res, next) => {
    if (!req.session.username) return res.status(401).json(errors.UNAUTHORIZED);
    next();
};

module.exports = {
    isAuthenticated
};