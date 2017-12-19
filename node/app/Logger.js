var winston = require('winston');
const tsFormat = () => (new Date()).toLocaleTimeString();

/* Configure winston logger */
var logger = new (winston.Logger) ({
    transports: [
        new (winston.transports.Console) ({name:'console',timestamp: tsFormat, colorize: true, level: 'debug'}),
        new (winston.transports.File) ({name: "error", timestamp: tsFormat, colorize: true, filename: './logs/error.log',level: 'error' }),
        new (winston.transports.File) ({name: "debug", timestamp: tsFormat, colorize: true, filename: './logs/debug.log',level: 'debug' }),
        new (winston.transports.File) ({name: "master", timestamp: tsFormat, colorize: true, filename: './logs/master.log',level: 'info'})
    ]
});

function logSession(sessionId, message, logType){
    message = "[SessionId: " + sessionId + "] - " + message;
    if(logType)
        logger.log(logType,message);
    else
        logger.info(message);
}

/* Export */
module.exports = {
    logger: logger,
    logSession: logSession
};