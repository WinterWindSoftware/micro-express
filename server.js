import express from 'express';
import routes from './routes/routes';
import http from 'http';
import logger from './components/app-logger';
import bodyParser from 'body-parser';
import morgan from 'morgan';

var app = express();

//Wire-up middleware for parsing JSON and logging HTTP requests
app.use(bodyParser.json());
app.use(morgan(':date :method :url :status :res[content-length] - :response-time ms'));

//Wire-up routes
routes(app);

// Start server
var server = http.createServer(app);
logger.profile('Express server startup');
server.listen(5000, () => {
    logger.profile('Express startup');
});
