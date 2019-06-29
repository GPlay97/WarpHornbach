const express = require('express');
const session = require('express-session');
const errors = require('./errors.json');
const config = require('./config.json');
const logger = require('./utils/logger');

const usersRouter = require('./routes/users');
const activityRouter = require('./routes/activities');

const authMiddleware = require('./middlewares/auth');

const app = express();

// ensure that session secret is set
if (!config.SESSION_SECRET) throw new Error('Session secret is not set');
// session handling
app.use(session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false
    }
}));

// route parsing
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

// route handling
app.use('/users', usersRouter);
app.use('/activities', authMiddleware.isAuthenticated, activityRouter);

// unknown route
app.use((_, res) => res.status(404).json(errors.UNKNOWN_ROUTE));

// error handling
app.use((err, req, res, next ) => {
    if (!err) err = {};

    logger.error('An error occurred on ' + req.method + ' ' + req.url, err);

    if (res.headersSent) return next(err);
    const status = parseInt(err.status || err.code) || 500;

    res.status(status >= 400 && status < 600 ? status : 422).json({
        err: config.ENVIRONMENT === 'development' ? err : status === 500 ? errors.INTERNAL_ERROR.message : errors.UNPROCESSABLE_ENTITY.message
    });
});

app.listen(config.PORT, () => console.log('[HTTP] Server started on port ', config.PORT));

module.exports = app;