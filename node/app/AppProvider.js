const baseProvider = require('./BaseProvider');
var logger = baseProvider.logger;
var validation = require('./Validation');
var provider = require('./CredentialProvider');
var Statuses = baseProvider.Statuses;

/* Function for running sql commands */
var runCommand = baseProvider.runCommand;

/* Getter provider functions */

var getAppByAppId = function (appId, callback) {
    var sqlQuery = "SELECT * FROM Apps WHERE AppId=" + appId + ";";

    runCommand(sqlQuery, function (result) {
        if(callback)
            callback(result);
    });
};

var getMostRecentAppByDetails = function(appName,startCommand, creatorUserId, callback) {
    var sqlQuery = "SELECT * FROM Apps WHERE " +
        "AppName='" +
        appName+ "' AND startCommand='" +
        startCommand + "' AND creatorUserId='" +
         creatorUserId + "' ORDER BY CreateDate DESC;";

    runCommand(sqlQuery, function(result) {
        if(callback)
            callback(result);
    })
};

var getAppsByCreatorUserId = function (userId, callback) {
    var sqlQuery = "SELECT * FROM Apps WHERE CreatorUserId=" + userId + ";";

    runCommand(sqlQuery, function (result) {
        if(callback)
            callback(result);
    });
};

var getAppsByGroupId = function (groupId, callback) {
    var sqlQuery = "SELECT * FROM Apps WHERE GroupId=" + groupId + ";";

    runCommand(sqlQuery, function (result) {
        if(callback)
            callback(result);
    });
};

var getAllAppsForUserId = function (userId, callback) {
    var sqlQuery = "SELECT * FROM Permissions WHERE CreatorUserId=" + userId + ";";

    runCommand(sqlQuery, function (result) {
        if(callback)
            callback(result);
    });
};

var getPermissionByPermissionId = function (permissionId, callback) {
    var sqlQuery = "SELECT * FROM AppPermissions WHERE PermissionId=" + permissionId + ";";

    runCommand(sqlQuery, function (result) {
        if(callback)
            callback(result);
    });
};

var getPermissionsByAppId = function(appId, callback) {
    var sqlQuery = "SELECT * FROM AppPermissions WHERE AppId=" + appId + ";";
    runCommand(sqlQuery,function(result) {
        if(callback)
            callback(result);
    });
};

var getLogByLogId = function (logId, callback) {
    var sqlQuery = "SELECT * FROM Logs WHERE LogId=" + logId + ";";

    runCommand(sqlQuery, function (result) {
        if(callback)
            callback(result);
    });
};

var getLogsByAppId = function(appId, callback) {
    var sqlQuery = "SELECT * FROM Logs WHERE AppId=" + appId + ";";

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
            var sqlQuery = "INSERT INTO Apps(CreatorUserId,AppName,StartCommand) " +
                "VALUES(" + creatorUserId + ",'" + appName + "','" + startCommand + "');";
            runCommand(sqlQuery, function (result) {
                if(callback)
                    callback(result);

            });
        }
    })
};


var addPermissions = function (appId, userId, groupId, read, write, execute, callback) {

    var sqlQuery = "INSERT INTO AppPermissions(AppId, UserId, GroupId, ReadPermission, WritePermission, ExecutePermission) " +
        "VALUES(" + appId + ", " + userId + ", " + groupId + ", " + read + ", " + write + ", " + execute + ");";
    runCommand(sqlQuery, function (result) {
        if(callback)
            callback(result);
    });
};

var addLogs = function (appId, path, logName, callback) {
    var sqlQuery = "INSERT INTO AppPermissions(LogId, AppId, Path, LogName) " +
        "VALUES(" + appId + ", '" + path + "', '" + logName + "');";
    runCommand(sqlQuery, function (result) {
        if(callback)
            callback(result);
    });
};

/* Delete functions */
var deleteAppByAppId = function(appId, callback) {
    var sqlQuery = "UPDATE Apps SET Active=0 WHERE AppId=" + appId + ";";
    runCommand(sqlQuery, function (result) {
        if(callback)
            callback(result);
    });
};

var deleteAppPermissionByPermissionId = function(permissionId, callback) {
    var sqlQuery = "UPDATE AppPermissions SET Active=0 WHERE PermissionId=" + permissionId + ";";
    runCommand(sqlQuery, function (result) {
        if(callback)
            callback(result);
    });
};

var deleteAppLogByLogId = function(logId, callback) {
    var sqlQuery = "UPDATE AppLogs SET Active=0 WHERE LogId=" + logId + ";";
    runCommand(sqlQuery, function (result) {
        if(callback)
            callback(result);
    });
};

/* Update functions */
var updateApp = function (appId, appName, startCommand, callback) {
    if(appName) {
        updateAppName(appName,appId,function(result) {
            updateAppStartCommand(startCommand,appId,function(result) {
                if(callback)
                    callback();
            });
        });
    }
    else {
        updateAppStartCommand(startCommand,appId,function(result) {
            if(callback)
                callback();
        })
    }
};

var updateAppName = function(appName, appId, callback) {
    var sqlQuery = "UPDATE Apps SET AppName='" + appName + "' WHERE appId=" + appId + ";";
    runCommand(sqlQuery, function (result) {
        if(callback)
            callback(result);
    });
};

var updateAppStartCommand = function(appStartCommand, appId, callback) {
    var sqlQuery = "UPDATE Apps SET StartCommand='" + appStartCommand + "' WHERE appId=" + appId + ";";
    runCommand(sqlQuery, function (result) {
        if(callback)
            callback(result);
    });
};


var updatePermissions = function (appId, adminId, groupId, read, write, execute, callback) {

    var sqlQuery = "INSERT INTO AppPermissions(AppId, AdminId, GroupId, ReadPermission, WritePermission, ExecutePermission) " +
        "VALUES(" + appId + ", " + adminId + ", " + groupId + ", " + read + ", " + write + ", " + execute + ");";
    runCommand(sqlQuery, function (result) {
        if(callback)
            callback(result);
    });
};

var updateLogs = function (appId, path, logName, callback) {
    var sqlQuery = "INSERT INTO AppPermissions(LogId, AppId, Path, LogName) " +
        "VALUES(" + appId + ", '" + path + "', '" + logName + "');";
    runCommand(sqlQuery, function (result) {
        if(callback)
            callback(result);
    });
};

module.exports = {
    Statuses: Statuses,
    getAppByAppId : getAppByAppId,
    getMostRecentAppByDetails: getMostRecentAppByDetails,
    getAppsByCreatorUserId : getAppsByCreatorUserId,
    getAppsByGroupId : getAppsByGroupId,
    getAllAppsForUserId : getAllAppsForUserId,
    getPermissionByPermissionId : getPermissionByPermissionId,
    getPermissionsByAppId: getPermissionsByAppId,
    getLogByLogId : getLogByLogId,
    getLogsByAppId: getLogsByAppId,
    addApp : addApp,
    addPermissions : addPermissions,
    addLogs : addLogs,
    deleteAppByAppId: deleteAppByAppId,
    deleteAppPermissionByPermissionId: deleteAppPermissionByPermissionId,
    deleteAppLogByLogId: deleteAppLogByLogId,
    updateApp: updateApp
};