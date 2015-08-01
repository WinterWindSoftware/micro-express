import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import config from './config/config'
import logger from './components/app-logger';
import routes from './routes/routes';

var app = express();

//Wire-up middleware for parsing JSON, logging HTTP requests and serving static content
app.use(bodyParser.json());
app.use(morgan(':date[iso] :method :url :status :res[content-length] - :response-time ms'));
app.use(express.static(`${config.root}/client`));

//Wire-up routes
routes(app);

// Start server
var server = http.createServer(app);
server.listen(config.port, () => {
    logger.info('Express server started.');
});
