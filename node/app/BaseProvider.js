const winston = require('./Logger');
const fs = require('fs');
var mysql = require('mysql');
var pool;
var logger = winston.logger;

var Statuses = {"Success": "success", "Error": "error"};

fs.readFile('./config/sql.config', 'utf-8', function (err, contents) {
    logger.info("Reading sql config file");
    if (err) {
        logger.error("Error opening database config file")
    }
    else {
        var poolConfig = JSON.parse(contents);

        pool = mysql.createPool(poolConfig);
        logger.info("Database configured");
    }
});

/* Function for running sql commands */
var runCommand = function (sqlQuery, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            logger.error("Provider Error: Error opening connection");
            logger.log('debug', "Provider runCommand, Query: " + sqlQuery);
            var returnObject = {"status": Statuses.Error, "message": "Error opening database connection"};
            connection.release();
            callback(returnObject)
        }
        else {
            connection.query(sqlQuery, function (err, results, fields) {
                connection.release();
                if (err) {
                    logger.error("Provider Error: Error running command");
                    logger.log('debug', "Provider runCommand, Query: " + sqlQuery);
                    var returnObject = {"status": Statuses.Error, "message": "Error running command"};
                    callback(returnObject);
                    return;
                }

                var firstResult;
                if(results.constructor === Array)
                    firstResult = results[0];
                else
                    firstResult = results;

                var returnObject = {"status": Statuses.Success, "results": results, "fields": fields, "firstResult": firstResult};
                callback(returnObject);
            });
        }
    });
};

/* Export */
module.exports = {
  Statuses: Statuses,
    runCommand: runCommand,
    logger: logger
};