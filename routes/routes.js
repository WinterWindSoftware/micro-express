import logger from '../components/app-logger';

export default (app) => {
    app.use('/system', require('./system/system.controller'));

    app.get('/', (req, res) => {
        res.json({
            msg: 'Welcome!'
        });
    });

    // All undefined asset or api routes should return a 404
    //app.route('/:url(api|auth|components|app|bower_components|assets)/*').get(errors[404]);

    //Catch-all error handler
    app.use((err, req, res, next) => {
        logger.error('Unhandled server error', err);
        res.status(500).json({
            error: 'An unexpected error occurred'
        });
    });


    //unhandled errors
    //app.use(errors.unhandledError);
}
