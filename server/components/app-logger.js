import winston from 'winston';
import util from 'util';
import _ from 'lodash';

var logConfig = {
    levels: {
        trace: 0,
        input: 1,
        verbose: 0,
        prompt: 3,
        debug: 4,
        info: 5,
        data: 6,
        help: 7,
        warn: 8,
        error: 9
    },
    colors: {
        trace: 'magenta',
        input: 'grey',
        verbose: 'cyan',
        prompt: 'grey',
        debug: 'blue',
        info: 'green',
        data: 'grey',
        help: 'cyan',
        warn: 'yellow',
        error: 'red'
    }
};
winston.addColors(logConfig.colors);
var consoleTransport = {
    level: 'debug',
    prettyPrint: true,
    colorize: true,
    silent: false,
    timestamp: true
};

var appLogger = new winston.Logger({
    levels: logConfig.levels,
    colors: logConfig.colors,
    transports: [
        new winston.transports.Console(consoleTransport)
    ]
});

//Add custom API methods

appLogger.error = function(msg, err, metadata) {
    var extra = metadata ? _.merge( {error: err }, metadata || {}) : err;
    return this.log('error', util.format('%s. %s', msg, err), extra);
};

export default appLogger;
