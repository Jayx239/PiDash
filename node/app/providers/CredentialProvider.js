const baseProvider = require('./BaseProvider');
var logger = baseProvider.logger;
var validation = require('../Validation');
var sqlString = baseProvider.sqlString;
var Statuses = baseProvider.Statuses;

/* Function for running sql commands */
var runCommand = baseProvider.runCommand;

/* Database get provider functions */
var getUserByUserName = function (userName, callback) {
    var sqlQuery = sqlString.format("SELECT * FROM Users WHERE UserName=?;", [userName]);
    runCommand(sqlQuery, function (result) {
        callback(result);
    });
};

var getUserByUserId = function (userId, callback) {
    var sqlQuery = sqlString.format("SELECT * FROM Users WHERE UserId=?;", [userId]);
    runCommand(sqlQuery, function (result) {
        callback(result);
    });
};

var getCredentialsByUserId = function (userId, callback) {
    var sqlQuery = sqlString.format("SELECT * FROM Credentials WHERE UserId=?;", [userId]);
    runCommand(sqlQuery, function (result) {
        callback(result);
    });
};

var getCredentialsByUserName = function (userName, callback) {
    var sqlQuery = sqlString.format("SELECT * FROM Users AS U " +
        "INNER JOIN Credentials AS C " +
        "ON U.UserId = C.UserId " +
        "WHERE U.UserName=?;", [userName]);

    runCommand(sqlQuery, function (result) {
        callback(result);
    });
};

var getGroupByGroupId = function (groupId, callback) {
    var sqlQuery = sqlString.format("SELECT * FROM Groups WHERE GroupId=?;", [groupId]);
    runCommand(sqlQuery, function (result) {
        callback(result);
    });
};

var getAdminByUserId = function (userId, callback) {
    var sqlQuery = sqlString.format("SELECT * FROM Admins WHERE UserId=?;", [userId]);
    runCommand(sqlQuery, function (result) {
        callback(result);
    });
};

var getAdminByUserName = function (userName, callback) {
    var sqlQuery = sqlString.format("SELECT * FROM Users AS U " +
        "INNER JOIN Admins AS A " +
        "ON U.UserId = A.UserId " +
        "WHERE U.UserName=?;", [userName]);
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
            var sqlQuery = sqlString.format("INSERT INTO Users(UserName,PrimaryEmail,FirstName,MiddleName,LastName,BirthDay,BirthMonth,BirthYear) VALUES(?,?,?,?,?,?,?,?);",[userName, primaryEmail, firstName, middleName, lastName, birthDay, birthMonth, birthYear]);
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

var addCredentialsForUserById = function (userId, passwordHash, salt, callback) {
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

                        var sqlQuery = sqlString.format("INSERT INTO Credentials(UserId,Salt,Hash) " +
                            "VALUES(?,?,?);", [userId, salt, passwordHash]);
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

var addCredentialsByUserName = function(userName, passwordHash, salt, callback) {
    getUserByUserName(userName, function (result) {
        if (result.status === Statuses.Error) {
            logger.log('debug', "Error adding credentials ,Result: " + result);
            callback(result);
        }
        else {
            var userId = result.results[0].UserId;
            addCredentialsForUserById(userId, passwordHash, salt, function (result) {
                if (result.status === Statuses.Error || result.results.length < 1) {
                    logger.debug('Error adding credentials, credentials already exist for User name: ' + userName);
                }
                callback(result);
            });
        }
    });
};

var updateCredentialsForUserById = function (userId, passwordHash, salt, callback) {
    getCredentialsByUserId(userId, function (result) {
        if (result.status !== Statuses.Error && result.results.length > 0 ) {
                        var sqlQuery = sqlString.format("UPDATE Credentials " +
                            "SET Salt=?, " +
                            "Hash=? " +
                            "WHERE UserId=?;", [salt, passwordHash, userId]);

                        runCommand(sqlQuery, function (result) {
                            callback(result);
                        });
                    }
                    else {
                        logger.log('debug','Error updating credentials, no credentials exist for User id: ' + userId);
                        callback(result);
                    }
                });

        };
var updateCredentialsByUserName = function (userName, passwordHash, salt, callback) {
    getUserByUserName(userName, function (result) {
        if (result.status === Statuses.Error) {
            logger.log('debug', "Error updating credentials ,Result: " + result);
            callback(result);
        }
        else if(result.results.length < 0){
            logger.log('debug', "Error updating credentials, User name not found, UserName: " + userName);
            callback(result);
        }
        else {
            var userId = result.firstResult.UserId;
            updateCredentialsForUserById(userId, passwordHash, salt, function (result) {
                if (result.status === Statuses.Error) {
                    logger.debug('Error updating credentials, UserName: ' + userName);
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
        if (groupId) {
            getGroupByGroupId(groupId, function (result) {
                if (result.status === Statuses.Error || result.results.length < 1) {
                    logger.log('debug', 'Invalid group id, adding admin failed');
                    callback(result);
                    return;
                }
                else {
                    var sqlQuery = sqlString.format("INSERT INTO Admins(UserId,GroupId,Active) Values(?,?,?);", [userId, groupId, isActive]);

                    runCommand(sqlQuery, function (result) {
                        callback(result);

                    });
                }
            });
        }
        else {
            var sqlQuery = sqlString.format("INSERT INTO Admins(UserId,GroupId,Active) " +
                "Values(?,?,?);", [userId, groupId, isActive]);

            runCommand(sqlQuery, function (result) {
                callback(result);
                return;
            });
        }
    });

};

var addAdminByUserName = function (userName, groupId, isActive, callback) {
    var sqlQuery = "SELECT * FROM Users WHERE UserName='" + userName + "';";
    runCommand(sqlQuery, function (result) {
        if (result.status === Statuses.Error || result.results.length < 1) {
            logger.log('debug', 'Invalid User name, adding admin failed');
            callback(result);
            return;
        }
        else {
            addAdminByUserId(result.firstResult.UserId, groupId, isActive, callback);
        }
    })
};

var activateAdminByAdminId = function(adminId, callback) {
    var sqlQuery = sqlString.format("UPDATE Admins SET Active = 1 WHERE AdminId=?;",[adminId]);
    runCommand(sqlQuery,function(result) {
        if(callback)
            callback(result)
    });
};

var deActivateAdminByAdminId = function(adminId, callback) {
    var sqlQuery = sqlString.format("UPDATE Admins SET Active = 0 WHERE AdminId=?;",[adminId]);
    runCommand(sqlQuery,function(result) {
        if(callback)
            callback(result)
    });
};

var deActivateAdminByUserId = function(userId, callback) {
    var sqlQuery = sqlString.format("UPDATE Admins SET Active = 0 WHERE UserId=?;", [userId]);
    runCommand(sqlQuery,function(result) {
        if(callback)
            callback(result)
    });
};

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
    addCredentialsByUserName: addCredentialsByUserName,
    updateCredentialsForUserById: updateCredentialsForUserById,
    updateCredentialsByUserName: updateCredentialsByUserName,
    addAdminByUserName: addAdminByUserName,
    activateAdminByAdminId: activateAdminByAdminId,
    deActivateAdminByAdminId: deActivateAdminByAdminId,
    deActivateAdminByUserId: deActivateAdminByUserId,
    sqlString: sqlString
};
