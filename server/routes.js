export default (app) => {
    app.use('/api', require('./api/api.routes'));
    app.use('/', require('./html/html.routes'));
}
