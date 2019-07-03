const express = require('express');
const fs = require('fs');
const https = require('https');
const session = require('express-session');
const cors = require('cors');
const errors = require('./errors.json');
const config = require('./config.json');
const logger = require('./utils/logger');

const usersRouter = require('./routes/users');
const activityRouter = require('./routes/activities');
const statsRouter = require('./routes/stats');

const authMiddleware = require('./middlewares/auth');

const app = express();

const httpsServer = config.SSL ? https.createServer({
    ca: fs.readFileSync(config.CHAIN_PATH, 'utf-8'),
    key: fs.readFileSync(config.PRIVATE_KEY_PATH, 'utf-8'),
    cert: fs.readFileSync(config.CERTIFICATE_PATH, 'utf-8')
}, app) : false;

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

// Cross-Origin-Resource-Sharing support
app.use(cors({
    credentials: true,
    /**
     * Handles the origin for CORS request
     * @param {String} origin the origin
     * @param {Function} callback callback function
     */
    origin: (origin, callback) => {
        if (!origin || origin === 'null') origin = '*';
        callback(null, origin);
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
app.use('/stats', authMiddleware.isAuthenticated, statsRouter);

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

if (!httpsServer) app.listen(config.PORT, () => console.log('[HTTP] Server started on port ', config.PORT));
else httpsServer.listen(config.PORT, () => console.log('[HTTPS] Server started on port ', config.PORT));

module.exports = app;
