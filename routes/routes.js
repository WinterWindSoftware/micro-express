export default (app) => {
    app.use('/system', require('./system/system.controller'));

    app.get('/', (req, res) => {
        res.json({
            msg: 'Welcome!'
        });
    });

    // All undefined asset or api routes should return a 404
    //app.route('/:url(api|auth|components|app|bower_components|assets)/*').get(errors[404]);

    //unhandled errors
    //app.use(errors.unhandledError);
}
