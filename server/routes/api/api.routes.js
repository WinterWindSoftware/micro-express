import express from 'express';
import logger from '../../components/app-logger';
var router = express.Router();

router.get('/', (req, res) => {
    res.json({
        msg: 'systems ok'
    });
});

router.use('/system', require('./system/system.controller'));

// ERROR HANDLERS (these must be wired up last)
// 404
router.use((req, res) => {
    res.status(404).json({
        error: 'You took the wrong route, bud!'
    });
});

// 500 - Catch-all error handler
router.use((err, req, res, next) => {
    logger.error('Unhandled server error in API', err);
    res.status(500).json({
        error: 'An unexpected error occurred'
    });
});

export default router;
