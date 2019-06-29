const errors = require('../errors.json');

const isAuthenticated = (req, res, next) => {
    if (!req.session.authenticated) return res.status(401).json(errors.UNAUTHORIZED);
    next();
};

module.exports = {
    isAuthenticated
};