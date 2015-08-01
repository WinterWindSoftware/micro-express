import logger from '../components/app-logger';

export default (app) => {
    // STANDARD ROUTE HANDLERS
    app.get('/', (req, res) => {
        res.json({
            msg: 'Welcome!'
        });
    });
    app.use('/system', require('./system/system.controller'));

    // ERROR HANDLERS (these must be wired up last)
    // 404
    app.use((req, res) => {
        res.status(404).json({error: 'You took the wrong route, bud!'});
    });

    // 500 - Catch-all error handler
    app.use((err, req, res, next) => {
        logger.error('Unhandled server error', err);
        res.status(500).json({
            error: 'An unexpected error occurred'
        });
    });
}
