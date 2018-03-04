const winston = require('../Logger');
const fs = require('fs');
var mysql = require('mysql');
var pool;
var logger = winston.logger;
var configFile = "./config/sql.config";
var Statuses = {"Success": "success", "Error": "error"};
var databaseConfigured = false;

/* Method for starting/configuring database */
var configureDatabase = function(callback) {
    fs.readFile(configFile, 'utf-8', function (err, contents) {
        logger.info("Reading sql config file");
        if (err) {
            logger.error("Error opening database config file");
            if(callback)
                callback(false);
        }
        else {
            var poolConfig = JSON.parse(contents);
            pool = mysql.createPool(poolConfig);
            databaseConfigured = true;
            logger.info("Database configured");

            if(callback)
                callback(true);
        }
    });
};

/* Function for running sql commands */
var runCommand = function (sqlQuery, callback) {
    if(!databaseConfigured)
        configureDatabase(function(success){
            if(!success){
                var returnObject = {"status": Statuses.Error, "message": "Error opening database connection"};
                if(callback)
                    callback(returnObject);
            }
            else
                runCommand(sqlQuery,callback);
    });

    pool.getConnection(function (err, connection) {
        if (err) {
            logger.error("Provider Error: Error opening connection");
            logger.log('debug', "Provider runCommand, Query: " + sqlQuery);
            var returnObject = {"status": Statuses.Error, "message": "Error opening database connection"};
            connection.release();
            if(callback)
                callback(returnObject)
        }
        else {
            connection.query(sqlQuery, function (err, results, fields) {
                connection.release();
                if (err) {
                    logger.error("Provider Error: Error running command");
                    logger.log('debug', "Provider runCommand, Query: " + sqlQuery);
                    var returnObject = {"status": Statuses.Error, "message": "Error running command"};
                    if(callback)
                        callback(returnObject);
                    return;
                }

                var firstResult;
                if(results.constructor === Array)
                    firstResult = results[0];
                else
                    firstResult = results;

                var returnObject = {"status": Statuses.Success, "results": results, "fields": fields, "firstResult": firstResult};
                if(callback)
                    callback(returnObject);
            });
        }
    });
};

var setConfigFile = function(newConfigFile,callback) {
    configFile = newConfigFile;
    databaseConfigured = false;
    configureDatabase(callback);
};

/* Export */
module.exports = {
    configureDatabase: configureDatabase,
  Statuses: Statuses,
    runCommand: runCommand,
    logger: logger,
    setConfigFile: setConfigFile

};