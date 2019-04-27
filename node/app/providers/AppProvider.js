const baseProvider = require('./BaseProvider');
var logger = baseProvider.logger;
var validation = require('../Validation');
var provider = require('./CredentialProvider');
var Statuses = baseProvider.Statuses;
var sqlString = baseProvider.sqlString;
/* Function for running sql commands */
var runCommand = baseProvider.runCommand;

/* Getter provider functions */

var getAppByAppId = function (appId, callback) {
    var sqlQuery = sqlString.format("SELECT * FROM Apps WHERE AppId=?;", [appId]);

    runCommand(sqlQuery, function (result) {
        if(callback)
            callback(result);
    });
};

var getMostRecentAppByDetails = function(appName,startCommand, creatorUserId, callback) {
    var sqlQuery = sqlString.format("SELECT * FROM Apps WHERE AppName=? AND startCommand=? AND creatorUserId=? ORDER BY CreateDate DESC;", [appName, startCommand, creatorUserId]);
    runCommand(sqlQuery, function(result) {
        if(callback)
            callback(result);
    })
};

var getAppsByUserId = function(userId, callback) {
    var sqlQuery = sqlString.format("SELECT A.* FROM Apps A INNER JOIN AppPermissions P ON P.AppId=A.AppId WHERE P.UserId=?;", [userId]);
    runCommand(sqlQuery, function (result) {
        if(callback)
            callback(result);
    });
};

var getAppsByCreatorUserId = function (userId, callback) {
    var sqlQuery = sqlString.format("SELECT * FROM Apps WHERE CreatorUserId=?;", [userId]);

    runCommand(sqlQuery, function (result) {
        if(callback)
            callback(result);
    });
};

var getAppsByGroupId = function (groupId, callback) {
    var sqlQuery = sqlString.format("SELECT * FROM Apps WHERE GroupId=?;", [groupId]);

    runCommand(sqlQuery, function (result) {
        if(callback)
            callback(result);
    });
};

var getAllAppsForUserId = function (userId, callback) {
    var sqlQuery = sqlString.format("SELECT * FROM Permissions WHERE CreatorUserId=?;", [userId]);

    runCommand(sqlQuery, function (result) {
        if(callback)
            callback(result);
    });
};

var getPermissionByPermissionId = function (permissionId, callback) {
    var sqlQuery = sqlString.format("SELECT AP.*, U.UserName FROM AppPermissions AP INNER JOIN Users U ON AP.UserId=U.UserId WHERE PermissionId=?;", [permissionId]);

    runCommand(sqlQuery, function (result) {
        if(callback)
            callback(result);
    });
};

var getPermissionsByAppId = function(appId, callback) {
    var sqlQuery = sqlString.format("SELECT * FROM AppPermissions AP INNER JOIN Users U ON AP.UserId=U.UserId WHERE AppId=?;", [appId]);
    runCommand(sqlQuery,function(result) {
        if(callback)
            callback(result);
    });
};

var getLogByLogId = function (logId, callback) {
    var sqlQuery = sqlString.format("SELECT * FROM Logs WHERE LogId=?;", [logId]);

    runCommand(sqlQuery, function (result) {
        if(callback)
            callback(result);
    });
};

var getLogsByAppId = function(appId, callback) {
    var sqlQuery = sqlString.format("SELECT * FROM AppLogs WHERE AppId=?;", [appId]);

    runCommand(sqlQuery,function(result) {
        if(callback)
            callback(result);
    })
};


/* Insert provider functions */
var addApp = function (creatorUserId, appName, startCommand, callback) {
    provider.getUserByUserId(creatorUserId, function (result) {
        if (result.status === Statuses.Error || result.results.length < 0) {
            logger.log('debug', 'Invalid user id');
            if(callback)
                callback(result);
            return;
        }
        else {
            var sqlQuery = sqlString.format("INSERT INTO Apps(CreatorUserId,AppName,StartCommand) " +
                "VALUES(?,?,?)", [creatorUserId, appName, startCommand]);
            runCommand(sqlQuery, function (result) {
                if(callback)
                    callback(result);

            });
        }
    })
};


var addPermissions = function (appId, userId, groupId, read, write, execute, callback) {

    var sqlQuery = sqlString.format("INSERT INTO AppPermissions(AppId, UserId, GroupId, ReadPermission, WritePermission, ExecutePermission) " +
        "VALUES(?,?,?,?,?,?);", [appId, userId, groupId, read, write, execute]);
    runCommand(sqlQuery, function (result) {
        if(callback)
            callback(result);
    });
};

var addPermissionsByUserName = function(appId, userName, groupId, read, write, execute, callback) {
    var sqlQuery = sqlString.format("INSERT INTO AppPermissions(AppId, UserId, GroupId, ReadPermission, WritePermission, ExecutePermission) " +
        "VALUES(?,(SELECT UserId FROM Users WHERE UserName=? LIMIT 1),?,?,?,?);", [appId, userName, groupId, read, write, execute]);
    runCommand(sqlQuery, function (result) {
        if(callback)
            callback(result);
    });
};

var addLogs = function (appId, path, logName, callback) {
    var sqlQuery = sqlString.format("INSERT INTO AppLogs(AppId, Path, LogName) " +
        "VALUES(?,?,?);", [appId, path, logName]);
    runCommand(sqlQuery, function (result) {
        if(callback)
            callback(result);
    });
};

/* Delete functions */
var deleteAppByAppId = function(appId, callback) {
    var sqlQuery = sqlString.format("UPDATE Apps SET Active=0 WHERE AppId=?;", [appId]);
    runCommand(sqlQuery, function (result) {
        if(callback)
            callback(result);
    });
};

var deleteAppPermissionByPermissionId = function(permissionId, callback) {
    var sqlQuery = sqlString.format("UPDATE AppPermissions SET Active=0 WHERE PermissionId=?;", [permissionId]);
    runCommand(sqlQuery, function (result) {
        if(callback)
            callback(result);
    });
};

var deleteAppLogByLogId = function(logId, callback) {
    var sqlQuery = sqlString.format("UPDATE AppLogs SET Active=0 WHERE LogId=?;", [logId]);
    runCommand(sqlQuery, function (result) {
        if(callback)
            callback(result);
    });
};

/* Update functions */
var updateApp = function (appId, appName, startCommand, callback) {
    var sqlQuery = sqlString.format("UPDATE Apps SET AppName=?, StartCommand=? WHERE AppId=?;",[appName, startCommand, appId]) ;
    runCommand(sqlQuery, function (result) {
        if (callback)
            callback(result);
    });
};

var updatePermissions = function (permissionId, userId, groupId, read, write, execute, callback) {
    var sqlQuery = sqlString.format("UPDATE AppPermissions SET UserId=?, GroupId=?, ReadPermission=?, WritePermission=?, ExecutePermission=? WHERE PermissionId=?;", [userId, groupId, read, write, execute, permissionId]);
    runCommand(sqlQuery, function (result) {
        if(callback)
            callback(result);
    });
};

var updatePermissionsByUserName = function (permissionId, userName, groupId, read, write, execute, callback) {
    var sqlQuery = sqlString.format("UPDATE AppPermissions SET UserId=(SELECT UserId FROM Users WHERE UserName=? LIMIT 1), GroupId=?, ReadPermission=?, WritePermission=?, ExecutePermission=? WHERE PermissionId=?;", [userName, groupId, read, write, execute, permissionId]);
    runCommand(sqlQuery, function (result) {
        if(callback)
            callback(result);
    });
};

var updateLogs = function (logId, path, logName, callback) {
    var sqlQuery = sqlString.format("UPDATE AppLogs SET Path=?, LogName=? WHERE LogId=?;", + [path, logName, logId]);
    runCommand(sqlQuery, function (result) {
        if(callback)
            callback(result);
    });
};

module.exports = {
    Statuses: Statuses,
    getAppByAppId : getAppByAppId,
    getMostRecentAppByDetails: getMostRecentAppByDetails,
    getAppsByUserId: getAppsByUserId,
    getAppsByCreatorUserId : getAppsByCreatorUserId,
    getAppsByGroupId : getAppsByGroupId,
    getAllAppsForUserId : getAllAppsForUserId,
    getPermissionByPermissionId : getPermissionByPermissionId,
    getPermissionsByAppId: getPermissionsByAppId,
    getLogByLogId : getLogByLogId,
    getLogsByAppId: getLogsByAppId,
    addApp : addApp,
    addPermissions : addPermissions,
    addPermissionsByUserName: addPermissionsByUserName,
    addLogs : addLogs,
    deleteAppByAppId: deleteAppByAppId,
    deleteAppPermissionByPermissionId: deleteAppPermissionByPermissionId,
    deleteAppLogByLogId: deleteAppLogByLogId,
    updateApp: updateApp,
    updatePermissions: updatePermissions,
    updatePermissionsByUserName: updatePermissionsByUserName,
    updateLogs: updateLogs,
    sqlString: sqlString
};