/* Program for initializing the PiDash database
* Depends on sql.config for mysql configuration, Run 'make configurator' to generate the config file.
* */

const mysql = require('mysql');
const fs = require('fs');
var errors = false;
var configureDatabase = function(test, callback){
    var configFile;
    if(test)
        configFile = "./sqltest.config";
    else
        configFile = "./sql.config";

    fs.readFile(configFile, function (err, contents) {
        if (err) {
            console.log("Error reading sql config file");
            exitError(callback);
            return;
        }
        else {
            var sqlCreds = JSON.parse(contents);

            var sqlConn = mysql.createConnection({
                host: sqlCreds.host,
                user: sqlCreds.user,
                password: sqlCreds.password
            });

            sqlConn.connect(function (err) {
                if (err) {
                    console.log("Error connecting to db");
                    console.log("Connection State: " + sqlConn.state);
                    exitError(callback);
                    return;
                }
                createDatabase(sqlConn, sqlCreds.database, function () {
                    sqlConn.query("USE " + sqlCreds.database + ";", function (err, result, fields) {
                        if (err) {
                            console.log("Error using database");
                            exitError(callback);
                            return;
                        }
                        createUsersTable(sqlConn, function (sqlConn) {
                            createCredentialsTable(sqlConn, function (sqlConn) {
                                createGroupsTable(sqlConn, function (sqlConn) {
                                    createAdminsTable(sqlConn, function (sqlConn) {
                                        createAppsTable(sqlConn, function (sqlConn) {
                                            createAppPermissionsTable(sqlConn, function (sqlConn) {
                                                createAppLogsTable(sqlConn, function (sqlConn) {
                                                    console.log("----------- Database Setup Complete -----------");
                                                    if(callback)
                                                        callback();
                                                    return;
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        }

    });
};

function exitError(callback) {
    //console.log("Database configuration exited unexpectedly");
    errors = true;

    if(callback)
        callback();
}

var createDatabase = function (sqlConn, databaseName, callback) {
    var query = "CREATE DATABASE " + databaseName + ";";
    sqlConn.query(query, function (err, result, fields) {
        if (err) {
            console.log("Error creating PiDash Database");
        }
        else {
            console.log("Success: PiDash Database created");
        }
        if (callback)
            callback();
    })
};

var createUsersTable = function (sqlConn, callback) {
    var query = "CREATE TABLE Users(" +
        "CreateDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " +
        "LastUpdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, " +
        "UserId INT NOT NULL AUTO_INCREMENT PRIMARY KEY, " +
        "UserName VARCHAR(36), " +
        "PrimaryEmail VARCHAR(254), " +
        "FirstName VARCHAR(36) NOT NULL, " +
        "MiddleName VARCHAR(36), " +
        "LastName VARCHAR(36), " +
        "BirthDay INT CHECK(BirthDay > 0 AND BirthDay <= 31), " +
        "BirthMonth INT CHECK(BirthMonth > 0 AND BirthMonth <=12), " +
        "BirthYear INT);";

    sqlConn.query(query, function (err, result, fields) {
        if (err) {
            console.log("Error creating Users table");
            exitError();
        }
        else {
            console.log("Success: Users table created");
        }
        if (callback)
            callback(sqlConn);
    })
};


var createCredentialsTable = function (sqlConn, callback) {
    var query = "CREATE TABLE Credentials(" +
        "LastUpdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, " +
        "UserId INT NOT NULL, " +
        "Salt CHAR(16) NOT NULL, " +
        "Hash CHAR(128) NOT NULL, " +
        "FOREIGN KEY(UserId) REFERENCES Users(UserId));";
    sqlConn.query(query, function (err, result, fields) {
        if (err) {
            console.log("Error creating Credentials table");
            exitError();
        }
        else {
            console.log("Success: Credentials table created");
        }
        if (callback)
            callback(sqlConn);

    });
};

var createGroupsTable = function (sqlConn, callback) {
    var query = "CREATE Table Groups(" +
        "CreateDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " +
        "LastUpdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, " +
        "GroupId INT NOT NULL AUTO_INCREMENT PRIMARY KEY, " +
        "CreatorUserId INT NOT NULL, " +
        "GroupName VARCHAR(36), " +
        "Active BOOL DEFAULT 1, " +
        "FOREIGN KEY(CreatorUserId) REFERENCES Users(UserId));";
    sqlConn.query(query, function (err, result, fields) {
        if (err) {
            console.log("Error creating Groups table");
            exitError();
        }
        else {
            console.log("Success: Groups table created");
        }

        if (callback)
            callback(sqlConn);
    });
};
var createAdminsTable = function (sqlConn, callback) {
    var query = "CREATE TABLE Admins(" +
        "AdminId INT NOT NULL AUTO_INCREMENT PRIMARY KEY, " +
        "UserId INT NOT NULL, " +
        "LastUpdate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, " +
        "CreateDate DATETIME DEFAULT CURRENT_TIMESTAMP, " +
        "GroupId INT, " +
        "Active BOOL DEFAULT 1, " +
        "FOREIGN KEY(UserId) REFERENCES Users(UserId));";
    sqlConn.query(query, function (err, result, fields) {
        if (err) {
            console.log("Error creating Admins table");
            exitError();
        }
        else {
            console.log("Success: Admins table created");
        }
        if (callback)
            callback(sqlConn);

    });
};

var createAppsTable = function (sqlConn, callback) {
    var query = "CREATE TABLE Apps(" +
        "AppId INT NOT NULL AUTO_INCREMENT PRIMARY KEY, " +
        "AppName varchar(256) NOT NULL, " +
        "StartCommand varchar(256) NOT NULL, " +
        "CreatorUserId INT NOT NULL, " +
        "CreateDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " +
        "LastUpdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, " +
        "Active BOOL DEFAULT 1);";

    sqlConn.query(query, function (err, result, fields) {
        if (err) {
            console.log("Error creating Apps table");
            exitError();
        }
        else {
            console.log("Success: Apps table created");
        }
        if (callback)
            callback(sqlConn);

    });
};

var createAppPermissionsTable = function (sqlConn, callback) {
    var query = "CREATE TABLE AppPermissions(" +
        "PermissionId INT NOT NULL AUTO_INCREMENT PRIMARY KEY, " +
        "AppId INT NOT NULL, " +
        "UserId INT, " +
        "GroupId INT, " +
        "ReadPermission BIT, " +
        "WritePermission BIT, " +
        "ExecutePermission BIT, " +
        "Active BOOL DEFAULT 1, " +
        "FOREIGN KEY(AppId) REFERENCES Apps(AppId));";

    sqlConn.query(query, function (err, result, fields) {
        if (err) {
            console.log("Error creating AppPermissions table");
            exitError();
        }
        else {
            console.log("Success: AppPermissions table created");
        }
        if (callback)
            callback(sqlConn);

    });
};

var createAppLogsTable = function (sqlConn, callback) {
    var query = "CREATE TABLE AppLogs(" +
        "LogId INT AUTO_INCREMENT PRIMARY KEY, " +
        "AppId INT NOT NULL, " +
        "Path VARCHAR(256), " +
        "LogName VARCHAR(256), " +
        "Active BOOL DEFAULT 1)";

    sqlConn.query(query, function (err, result, fields) {
        if (err) {
            console.log("Error creating AppLogs table");
            exitError();
        }
        else {
            console.log("Success: AppLogs table created");
        }
        if (callback)
            callback(sqlConn);

    });
};


/* Create and configure database */
configureDatabase(false,function(){

    /* Create and configure test database */
    configureDatabase(true, function() {
        if(errors)
            process.exit(-1);
        else
            process.exit(0);

    });
});

module.exports = {
    configureDatabase: configureDatabase,
    createDatabase: createDatabase,
    createAdminsTable: createAdminsTable,
    createGroupsTable: createGroupsTable,
    createCredentialsTable: createCredentialsTable,
    createUsersTable: createUsersTable,
    createAppsTable: createAppsTable,
    createAppPermissionsTable: createAppPermissionsTable,
    createAppLogsTable: createAppLogsTable
};
