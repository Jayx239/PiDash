const baseProvider = require('./BaseProvider');
var logger = baseProvider.logger;
var validation = require('./Validation');

var Statuses = baseProvider.Statuses;

/* Function for running sql commands */
var runCommand = baseProvider.runCommand;

/* Getter provider functions */

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

var getPermissionsByAppId = function(appId, callback) {
    var sqlQuery = "SELECT * FROM AppPermissions WHERE AppId=" + appId + ";";
    runCommand(sqlQuery,function(result) {
        callback(result);
    });
};

var getLogByLogId = function (logId, callback) {
    var sqlQuery = "SELECT * FROM Logs WHERE LogId=" + logId + ";";

    runCommand(sqlQuery, function (result) {
        callback(result);
    });
};

var getLogsByAppId = function(appId, callback) {
    var sqlQuery = "SELECT * FROM Logs WHERE AppId=" + appId + ";";

    runCommand(sqlQuery,function(result) {
        callback(result);
    })
};


/* Insert provider functions */
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

module.exports = {
    Statuses: Statuses,
    getAppByAppId : getAppByAppId,
    getAppsByCreatorUserId : getAppsByCreatorUserId,
    getAppsByGroupId : getAppsByGroupId,
    getAllAppsForUserId : getAllAppsForUserId,
    getPermissionByPermissionId : getPermissionByPermissionId,
    getPermissionsByAppId: getPermissionsByAppId,
    getLogByLogId : getLogByLogId,
    getLogsByAppId: getLogsByAppId,
    addApp : addApp,
    addPermissions : addPermissions,
    addLogs : addLogs
};