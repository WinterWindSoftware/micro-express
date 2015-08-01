import express from 'express';
import logger from '../../components/app-logger';
var router = express.Router();

const CLIENT_ROOT = {
    root: './client'
};

router.get('/', (req, res) => {
    res.sendFile('index.html', CLIENT_ROOT);
});

// ERROR HANDLERS (these must be wired up last)
// 404
router.use((req, res) => {
    res.status(404).sendFile('errors/404.html', CLIENT_ROOT);
});

// 500 - Catch-all error handler
router.use((err, req, res, next) => {
    logger.error('Unhandled server error', err);
    res.status(500).sendFile('errors/500.html', CLIENT_ROOT);
});

export default router;