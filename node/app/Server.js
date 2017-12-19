const express = require('express');
const app = express();
const fs = require('fs');
const helpers = require('./Helpers')
const bodyParser = require('body-parser');
var winston = require('./Logger');
var logger = winston.logger;
var IP = require('ip');
var defaultPort = 8000;
var port = defaultPort;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

fs.readFile('./config/server.config','utf-8', function(err,contents){
    port = defaultPort;
    var ip = IP.address();

    if(err) {
        app.listen(port,function(){
            logger.info("PiDash Server Started: Listening at "+ ip + ":" + port + " ...");
        });
        return;
    }
    else {
        var configuration = JSON.parse(contents);

        if(!helpers.isNullOrWhitespace(configuration.port)){
            port = configuration.port;
        }

        if(!helpers.isNullOrWhitespace(configuration.ip)){
            ip = configuration.ip;
            app.listen(port,function(){
                logger.info("PiDash Server Started: Listening at "+ ip + ":" + port + " ...");
            });
        }
        else {
            app.listen(port,function(){
                logger.info("PiDash Server Started: Listening at "+ ip + ":" + port + " ...");
            });
        }


    }
});

/* Export */
module.exports = {
    app : app,
    express : express,
    IP : IP,
    ip : IP.address,
    port: port,
    bodyParser: bodyParser
};