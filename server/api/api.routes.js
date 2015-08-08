import express from 'express';
import logger from '../components/app-logger';
var auth = require('../components/auth');

var router = express.Router();

//Require all routes to be authenticated
router.use(auth.loadToken);
router.use(auth.isAuthenticated().unless((req) => {
    return req.url === '/authenticate' && req.method === 'POST';
}));

router.get('/', (req, res) => {
    res.json({
        msg: 'systems ok'
    });
});

router.use('/', require('./auth/auth.controller'));
router.use('/system', require('./system/system.controller'));

// ERROR HANDLERS (these must be wired up last)

// 404
router.use((req, res) => {
    res.status(404).json({
        error: 'You took the wrong route, bud!'
    });
});

// 401/500 - Catch-all error handler
/*eslint no-unused-vars: 0*/
router.use((err, req, res, next) => {
    if (err.name && err.name === 'ValidationError') {
        //Handle mongoose validation error
        res.status(400).json({
            error: err
        });
    } else if (err.name === 'UnauthorizedError') {
        res.status(401).json({
            error: 'You must be authenticated to access this resource'
        });
    } else {
        logger.error('Unhandled API error', err);
        res.status(500).json({
            error: 'An unexpected error occurred'
        });
    }
});

export default router;