const winston = require('./Logger');
const fs = require('fs');
var mysql = require('mysql');
var pool;
var logger = winston.logger;
var validation = require('./Validation');

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

/* Function for running server commands */
var runCommand = function (sqlQuery, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            logger.error("Provider Error: Error opening connection");
            logger.log('debug', "Provider runCommand, Query: " + sqlQuery);
            var returnObject = {"status": Statuses.Error, "message": "Error opening database connection"};
            callback(returnObject)
        }
        else {
            connection.query(sqlQuery, function (err, results, fields) {
                if (err) {
                    logger.error("Provider Error: Error running command");
                    logger.log('debug', "Provider runCommand, Query: " + sqlQuery);
                    var returnObject = {"status": Statuses.Error, "message": "Error running command"};
                    callback(returnObject);
                    return;
                }
                var returnObject = {"status": Statuses.Success, "results": results, "fields": fields};
                callback(returnObject);
            });
        }
    });
};

/* Database get provider functions */
var getUserByUserName = function (userName, callback) {
    var sqlQuery = "SELECT * FROM Users WHERE UserName='" + userName + "';";
    runCommand(sqlQuery, function (result) {
        callback(result);
    });
};

var getUserByUserId = function (userId, callback) {
    var sqlQuery = "SELECT * FROM Users WHERE UserId=" + userId + ";";
    runCommand(sqlQuery, function (result) {
        callback(result);
    });
};

var getCredentialsByUserId = function (userId, callback) {
    var sqlQuery = "SELECT * FROM Credentials WHERE UserId='" + userId + "';";
    runCommand(sqlQuery, function (result) {
        callback(result);
    });
};

var getCredentialsByUserName = function (userName, callback) {
    var sqlQuery = "SELECT * FROM Users AS U " +
        "INNER JOIN Credentials AS C " +
        "ON U.UserId = C.UserId " +
        "WHERE U.UserName='" + userName + "';";

    runCommand(sqlQuery, function (result) {
        callback(result);
    });
};

var getGroupByGroupId = function (groupId, callback) {
    var sqlQuery = "SELECT * FROM Groups WHERE GroupId='" + groupId + "';";
    runCommand(sqlQuery, function (result) {
        callback(result);
    });
};

var getAdminByUserId = function (userId, callback) {
    var sqlQuery = "SELECT * FROM Admins WHERE UserId=" + userId + ";";
    runCommand(sqlQuery, function (result) {
        callback(result);
    });
};

var getAdminByUserName = function (userName, callback) {
    var sqlQuery = "SELECT * FROM Users AS U " +
        "INNER JOIN Admins AS A " +
        "ON U.UserId = A.UserId " +
        "WHERE U.UserName='" + userName + "';";
    runCommand(sqlQuery, function (result) {
        callback(result);
    });
};

var getAppByAppId = function (appId, callback) {
    var sqlQuery = "SELECT * FROM Apps WHERE AppId=" + appId + ";";

    runCommand(sqlQuery, function (result) {
        callback(result);
    });
};

var getAppsByCreatorUserId = function (userId, callback) {
    var sqlQuery = "SELECT * FROM Apps WHERE CreatorUserId=" + userId + ";";

    runCommand(sqlQuery, function (result) {
        callback(result);
    });
};

var getAppsByGroupId = function (groupId, callback) {
    var sqlQuery = "SELECT * FROM Apps WHERE GroupId=" + groupId + ";";

    runCommand(sqlQuery, function (result) {
        callback(result);
    });
};

var getAllAppsForUserId = function (userId, callback) {
    var sqlQuery = "SELECT * FROM Permissions WHERE CreatorUserId=" + userId + ";";

    runCommand(sqlQuery, function (result) {
        callback(result);
    });
};

var getPermissionByPermissionId = function (permissionId, callback) {
    var sqlQuery = "SELECT * FROM AppPermissions WHERE PermissionId=" + permissionId + ";";

    runCommand(sqlQuery, function (result) {
        callback(result);
    });
};

var getLogByLogId = function (logId, callback) {
    var sqlQuery = "SELECT * FROM Logs WHERE LogId=" + logId + ";";

    runCommand(sqlQuery, function (result) {
        callback(result);
    });
};

/* Insert provider functions */
var addUserToUsersTable = function (userName, primaryEmail, firstName, middleName, lastName, birthDay, birthMonth, birthYear, callback) {
    getUserByUserName(userName, function (returnObject) {
        if(returnObject.results.length > 0) {
            logger.log('debug', "Error adding user to Users table, UserName already exists");
            returnObject.status = Statuses.Error;
            returnObject.message = "User name already exists";
            callback(returnObject);
        }
        else if (returnObject.Status !== Statuses.Error) {
            logger.log('debug', "Valid UserName");
            var sqlQuery = "INSERT INTO Users(UserName,PrimaryEmail,FirstName,MiddleName,LastName,BirthDay,BirthMonth,BirthYear) VALUES('" + userName + "','" + primaryEmail + "','" + firstName + "','" + middleName + "','" + lastName + "'," + birthDay + "," + birthMonth + "," + birthYear + ");";
            runCommand(sqlQuery, function (result) {
                callback(result);
            });
        }
        else {
            logger.log('debug', "Error adding user to Users table");
            returnObject.message = "Error registering user";
            callback(returnObject);
        }
    });
};

var addCredentialsForUserById = function (userId, password, salt, callback) {
    getCredentialsByUserId(userId, function (result) {
        if (result.status === Statuses.Error || result.results.length < 1) {
            getUserByUserId(userId, function (result) {
                if (result.status === Statuses.Error) {
                    logger.log('debug', "Unable to add credentials, UserId not found, UserId: " + userId);
                    callback(result);
                    return;
                }
                getCredentialsByUserId(userId, function (result) {
                    if (result.error === Statuses.Error || result.results.length < 1) {

                        var sqlQuery = "INSERT INTO Credentials(UserId,Password,Salt) " +
                            "VALUES('" + userId + "','" + password + "','" + salt + "');";
                        runCommand(sqlQuery, function (result) {
                            callback(result);
                        });
                    }
                    else {
                        logger.debug('Error adding credentials, credentials already exist for User id: ' + userId);
                        callback(result);
                    }
                });
            });
        }
    });
};

var addCredentialsByUserName = function (userName, password, salt, callback) {
    getUserByUserName(userName, function (result) {
        if (result.status === Statuses.Error) {
            logger.log('debug', "Error adding credentials ,Result: " + result);
            callback(result);
        }
        else {
            var userId = result.results.UserId;
            addCredentialsForUserById(userId, password, salt, function (result) {
                if (result.status === Statuses.Error || result.results.length < 1) {
                    logger.debug('Error adding credentials, credentials already exist for User name: ' + userName);
                }
                callback(result);
            });
        }
    });
};

var addAdminByUserId = function (userId, groupId, isActive, callback) {
    if (!isActive) {
        isActive = true;
    }

    getUserByUserId(userId, function (result) {
        if (result.status === Statuses.Error || result.results.length < 1) {
            logger.log('debug', 'Invalid user id, adding admin failed');
            callback(result);
            return;
        }
        if (!groupId) {
            var sqlQuery = "INSERT INTO Admins(UserId,GroupId,Active)" +
                "Values(" + userId + ", " + groupId + ", " + isActive + ");";

            runCommand(sqlQuery, function (result) {
                callback(result);
                return;
            });
        }
        getGroupByGroupId(groupId, function (result) {
            if (result.status === Statuses.Error || result.results.length < 1) {
                logger.log('debug', 'Invalid group id, adding admin failed');
                callback(result);
                return;
            }
            else {
                var sqlQuery = "INSERT INTO Admins(UserId,GroupId,Active)" +
                    "Values(" + userId + ", " + groupId + ", " + isActive + ");";

                runCommand(sqlQuery, function (result) {
                    callback(result);

                });
            }
        });
    });

};

var addAdminByUserName = function (userName, groupId, isActive, callback) {
    var sqlQuery = "SELECT * FROM USERS WHERE UserName='" + userName + "';";
    runCommand(sqlQuery, function (result) {
        if (result.status === Statuses.Error || result.results.length < 1) {
            logger.log('debug', 'Invalid User name, adding admin failed');
            callback(result);
            return;
        }
        else {
            addAdminByUserId(result.results.UserId, groupId, isActive, callback);
        }
    })
};

var addApp = function (creatorUserId, appName, startCommand, callback) {
    getUserByUserId(creatorUserId, function (result) {
        if (result.status === Statuses.Error || result.results.length < 0) {
            logger.log('debug', 'Invalid user id');
            callback(result);
            return;
        }
        else {
            var sqlQuery = "INSERT INTO Apps(CreatorUserId,AppName,StartCommand) " +
                "VALUES(" + creatorUserId + ",'" + appName + "','" + startCommand + "');";
            runCommand(sqlQuery, function (result) {
                callback(result);

            });
        }
    })
};


var addPermissions = function (appId, permissionId, adminId, groupId, permission, callback) {

    var sqlQuery = "INSERT INTO AppPermissions(AppId,PermissionId,AdminId, GroupId, Permission) " +
        "VALUES(" + appId + ", " + permissionId + ", " + adminId + ", " + groupId + ", " + permission + ");";
    runCommand(sqlQuery, function (result) {
        callback(result);
    });
};

var addLogs = function (logId, appId, path, logName, callback) {
    var sqlQuery = "INSERT INTO AppPermissions(LogId, AppId, Path, LogName) " +
        "VALUES(" + logId + ", " + appId + ", '" + path + "', '" + logName + "');";
    runCommand(sqlQuery, function (result) {
        callback(result);
    });
};

/*var addCredentialsForUserById = function(userId, password, salt, callback) {
    var checkQuery = "SELECT * FROM Users as U "
    "WHERE U.UserName = '" + userId + "';";
    runCommand(checkQuery,function(result) {
        if(result.Status === Statuses.Error) {
            logger.log('debug',"Unable to add credentials, UserId not found, UserId: " + userId);
            callback(result);
        }
        var sqlQuery = "INSERT INTO Credentials(UserId,Password,Salt) " +
            "VALUES('" + userId + "','" + password + "','" + salt + "');";
        runCommand(sqlQuery, function (result) {
            callback(result);
        });
    });
};*/


/* Export */
module.exports = {
    Statuses: Statuses,
    getGroupByGroupId: getGroupByGroupId,
    getCredentialsByUserId: getCredentialsByUserId,
    getCredentialsByUserName: getCredentialsByUserName,
    getUserByUserId: getUserByUserId,
    getUserByUserName: getUserByUserName,
    getAdminByUserId: getAdminByUserId,
    getAdminByUserName: getAdminByUserName,
    addUserToUsersTable: addUserToUsersTable,
    addCredentialsByUserId: addCredentialsForUserById,
    addCredentialsByUserName: addCredentialsByUserName
};
