const express = require('express');
const app = express();
const fs = require('fs');
const helpers = require('./Helpers')
const bodyParser = require('body-parser');
var winston = require('./Logger');
var logger = winston.logger;
var defaultPort = 8000;
var port = defaultPort;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
const IP = {
	address: () => {
		return "10.0.0.1";
	},
	
};
var startServer = function(callback) {
    fs.readFile('./config/server.config', 'utf-8', function (err, contents) {
        port = defaultPort;
        var ip = IP.address();

        if (err) {
            app.listen(port, function () {
                logger.info("PiDash Server Started: Listening at " + ip + ":" + port + " ...");
            });
            if(callback)
                callback(false);
            return;
        }
        else {
            var configuration = JSON.parse(contents);

            if (!helpers.isNullOrWhitespace(configuration.port)) {
                port = configuration.port;
            }

            if (!helpers.isNullOrWhitespace(configuration.ip)) {
                ip = configuration.ip;
                app.listen(port, function () {
                    logger.info("PiDash Server Started: Listening at " + ip + ":" + port + " ...");

                    if(callback)
                        callback(true);
                });
            }
            else {
                app.listen(port, function () {
                    logger.info("PiDash Server Started: Listening at " + ip + ":" + port + " ...");

                    if(callback)
                        callback(true);
                });
            }


        }
    });
};



/* Export */
module.exports = {
    startServer: startServer,
    app: app,
    express: express,
    IP: IP,
    ip: IP.address,
    port: port,
    bodyParser: bodyParser
};
