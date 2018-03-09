const process = require('./routes/ProcessRoute');
const appProvider = require("./providers/AppProvider");
const logger = require('./Logger').logger;
const piDashApp = require('../content/js/PiDashApp');
const credentialProvider = require('./providers/CredentialProvider');

/* Import from shared files */
var PiDashApp = piDashApp.PiDashApp;
var App = piDashApp.App;
var AppLog = piDashApp.AppLog;
var AppPermission = piDashApp.AppPermission;
var AppUser = piDashApp.AppUser;
var Process = piDashApp.Process;


/* Process management functions */
ActiveApps = [];
var getAppById = function (appId, callback) {
    getAppByIdExtended(appId, false, callback);
};

var getAppByIdExtended = function(appId, noCache, callback) {
    if(!noCache && ActiveApps[appId]) {
        if(callback)
            callback(ActiveApps[appId].app);
        return;
    }
    appProvider.getAppByAppId(appId,function(result) {
        if(result.status === appProvider.Statuses.Error || result.results.length < 1 || result.firstResult.Active[0] == 0) {
            if(callback)
                callback(null);
        }
        else {
            var app = new App(result.firstResult.AppName, result.firstResult.AppId, result.firstResult.CreatorUserId, result.firstResult.StartCommand);
            if(callback)
                callback(app);
        }
    });
};

var getPiDashAppByAppId = function(appId, callback) {
    getPiDashAppByAppIdExtended(appId, false, callback);
};

var getPiDashAppByAppIdExtended = function(appId, noCache, callback) {
    if(!noCache && ActiveApps[appId]) {
        if(callback)
            callback(ActiveApps[appId]);
        return;
    }
    else {
        getAppByIdExtended(appId, true, function(app) {
            if(!app) {
                if(callback)
                    callback(app);
                return;
            }
            getLogsByAppId(appId,function(logs) {
                app.logs = logs;
                getAppPermissionsByAppId(appId,function(permissions) {

                    var newApp = new PiDashApp(app,permissions,-1);
                    ActiveApps[appId] = newApp;
                    if(callback)
                        callback(ActiveApps[appId]);
                })
            })
        });
    }
};

var getPiDashAppByDetails = function(piDashApp, callback) {
    appProvider.getMostRecentAppByDetails(piDashApp.app.name, piDashApp.app.startCommand, piDashApp.app.creatorUserId, function(result) {
        if(result.status === appProvider.Statuses.Error) {
            logger.error("Error retrieving PiDashApp by details");
            if(callback)
                callback(null);
            return;
        }
        else if(result.firstResult.Active[0] == 0) {
            if(callback)
                callback(null);
            return;
        }
        else
            getPiDashAppByAppId(result.firstResult.AppId, callback);
    });
};

var getLogsByAppId = function(appId, callback) {
    appProvider.getLogsByAppId(appId,function(result) {
        if(result.status === appProvider.Statuses.Error) {
            if(callback)
                callback([]);
            return;
        }

        logs = [];
        for(var i=0; i<result.results.length; i++) {
            if(result.results[i].Active == 0)
                continue;
            var log = new AppLog(result.results[i].LogId, result.results[i].AppId, result.results[i].Path,result.results[i].LogName);
            logs.push(log);
        }

        if(callback)
            callback(logs);

    });
};

var getAppPermissionsByAppId = function(appId, callback) {
    appProvider.getPermissionsByAppId(appId, function(result) {

        var appPermissions = [];
        for(var i=0; i<result.results.length; i++) {
            if(result.results[i].Active == 0)
                continue;
            var user = new AppUser(result.results[i].UserName,result.results[i].UserId);
            var appPermission = new AppPermission(result.results[i].PermissionId,result.results[i].AppId, user, result.results[i].GroupId, databaseBooleanToBoolean(result.results[i].ReadPermission[0]), databaseBooleanToBoolean(result.results[i].WritePermission[0]), databaseBooleanToBoolean(result.results[i].ExecutePermission[0]));
            appPermissions.push(appPermission);
        }
        if(callback)
            callback(appPermissions);
    });
};

// TODO: implement logic for getting full AppUser
var getAppUserByUserId = function(userId, callback) {
    return new piDashApp.AppUser(null,userId);
};

var getAppUserByUserName = function(userName, callback) {

};

var getPiDashAppsByUserId = function(userId, callback) {
    appProvider.getAppsByUserId(userId, function(results) {
        var piDashAppIds = [];
        if(results.results.length > 0) {
            for(var i=0; i<results.results.length; i++) {
                if(results.results[i].Active == 1)
                    piDashAppIds.push(results.results[i].AppId);
            }
            var piDashApps = [];
            getPiDashAppsByAppIds(piDashAppIds, function(piDashApps) {
                if(callback)
                    callback(piDashApps);
            });
        }
        else
        if(callback)
            callback([]);
    })
};
var getPiDashAppsByAppIds = function(piDashAppIds, callback) {
    var outputList = [];
    createListOperation(piDashAppIds, 0, getPiDashAppByAppId, outputList, function(piDashApps) {
        if(callback)
            callback(piDashApps);
    });
};

var createListOperation = function(elementList, currentListIndex, operationFunction, outputList, onComplete) {
    if(!elementList || currentListIndex >= elementList.length) {
        onComplete(outputList);
    }
    else {
        operationFunction(elementList[currentListIndex], function(output) {
            outputList.push(output);
            currentListIndex = currentListIndex+1;
            createListOperation(elementList, currentListIndex, operationFunction, outputList, onComplete);
        });
    }
};

/* Creates new PiDashApp from input data and stores it in the db */
var createPiDashApp = function() {

};

/* Adds PiDashApp to db */
var addPiDashApp = function(piDashApp, callback) {
    addApp(piDashApp.app,function() {
        appProvider.getMostRecentAppByDetails(piDashApp.app.name, piDashApp.app.startCommand, piDashApp.app.creatorUserId, function(result){
            setAllPiDashAppIds(piDashApp, result.firstResult.AppId);

            var logs = piDashApp.app.logs;
            addLogs(logs,0,function() {
                var appPermissions = piDashApp.appPermissions;
                addAppPermissions(appPermissions, 0, function() {
                    if(callback)
                        callback(piDashApp);
                });
            });
        });
    });
};

var setAllPiDashAppIds = function(piDashApp, appId) {
    piDashApp.app.appId = appId;
    setAppPermissionsAppId(piDashApp.appPermissions, appId);
    setAllLogsAppId(piDashApp.app.logs,appId);
};

var setAppPermissionsAppId = function(permissions, appId) {
    if(permissions)
        for(var i=0; i<permissions.length; i++) {
            permissions[i].appId = appId;
        }
};

var setAllLogsAppId = function(logs,appId) {
    if(logs)
        for(var i=0; i<logs.length; i++) {
            logs[i].appId = appId;
        }
};

var addApp = function(app, callback) {
    appProvider.addApp(app.creatorUserId, app.name, app.startCommand, function(result) {
        if(result.status === appProvider.Statuses.Error)
            logger.error("Error adding app to db");
        if(callback)
            callback();
    });
};

var addLog = function(log, callback) {
    appProvider.addLogs(log.appId,log.path,log.name,function(result) {
        if(result.status === appProvider.Statuses.Error)
            logger.error("Error adding log");
        if(callback)
            callback();
    });
};
var addLogs = function(logs,index, callback) {
    addListOperation(logs,index,addLog,callback);
};

var addAppPermission = function(appPermission, callback) {
    if(!appPermission) {
        if(callback)
            callback();
        return;
    }

    var groupId = appPermission.groupId;
    var userId = appPermission.appUser.userId;
    if(userId && userId > 0)
        userId = appPermission.appUser.userId;
    else
        userId = "(SELECT UserId FROM Users WHERE UserName='" + appPermission.appUser.userName + "' LIMIT 1)";

    appProvider.addPermissions(appPermission.appId, userId, appPermission.groupId, booleanToDatabaseBoolean(appPermission.read), booleanToDatabaseBoolean(appPermission.write),booleanToDatabaseBoolean(appPermission.execute), function(result){
        if(result.status === appProvider.Statuses.Error)
            logger.error("Error adding app permission");
        if(callback)
            callback();
    });
};

var addAppPermissions = function(permissions, permissionIndex, callback) {
    addListOperation(permissions,permissionIndex,addAppPermission,callback);
};

var addListOperation = function(elementList, currentListIndex, operationFunction, onComplete) {
    if(!elementList || currentListIndex >= elementList.length) {
        onComplete();
    }
    else {
        operationFunction(elementList[currentListIndex], function() {
            currentListIndex = currentListIndex+1;
            addListOperation(elementList, currentListIndex,operationFunction,onComplete);
        });
    }
};

var addProcess = function() {

};

var booleanToDatabaseBoolean = function(value) {
    if(value)
        return 1;
    else
        return 0;
};

var databaseBooleanToBoolean = function(value) {
    if(value == 1)
        return true;
    else
        return false;
};

/* Delete functions */
var deleteAppByAppId = function(appId, callback) {
    ActiveApps.splice(appId,1);
    appProvider.deleteAppByAppId(appId,callback);

};

var deleteAppPermissionByPermissionId = function(permissionId, callback) {
    var response = new Object();
    appProvider.deleteAppPermissionByPermissionId(permissionId,function(result) {
        if (result.status === appProvider.Statuses.Error) {
            response.status = "Error";
        }
        else {
            response.status = "Success";
        }
        if(callback)
            callback(response);
    });
};

var deleteAppLogByLogId = function(logId, callback) {
    var response = new Object();
    appProvider.deleteAppLogByLogId(logId,function(result) {
        if(result.status === appProvider.Statuses.Error) {
            response.status = "Error";
        }
        else {
            response.status = "Success";
        }
        if(callback)
            callback(response);
    });
};

/* Update functions */
var updatePiDashApp = function(piDashApp,callback) {
    updateApp(piDashApp.app.appId, piDashApp.app.name, piDashApp.app.startCommand, function() {
        var allLogs = piDashApp.app.logs;
        var newLogs = [];
        var currentLogs = [];
        for(var i=0; i<allLogs.length; i++) {
            if(allLogs[i].id < 0)
                newLogs.push(allLogs[i]);
            else
                currentLogs.push(allLogs[i]);
        }
        addLogs(newLogs,0,function() {
            updateLogs(currentLogs,0,function() {
                var allPermissions = piDashApp.appPermissions;
                var newPermissions = [];
                var currentPermissions = [];

                for(var i=0; i<allPermissions.length; i++) {
                    if(allPermissions[i].permissionId < 0)
                        newPermissions.push(allPermissions[i]);
                    else
                        currentPermissions.push(allPermissions[i]);
                }
                addAppPermissions(newPermissions,0,function() {
                    updateAppPermissions(currentPermissions,0,function() {
                        getPiDashAppByAppIdExtended(piDashApp.app.appId, true, function(updatedPiDashApp) {
                            if(callback)
                                callback(updatedPiDashApp);
                        });
                    })
                })
            });
        });
    });
};

var updateApp = function(appId, appName, appStartCommand, callback) {
    // TODO: Validate user has permission to update app
    appProvider.updateApp(appId,appName,appStartCommand,function() {
        if(callback)
            callback();
    })
};

var updateLogs = function(logs,index, callback) {
    addListOperation(logs,index,updateLog,callback);
};

var updateLog = function(log,callback) {
    appProvider.updateLogs(log.id, log.path, log.name,function(result) {
        if(result.status === appProvider.Statuses.Error)
            logger.error("Error updating log");
        if(callback)
            callback();
    });
};

var updateAppPermissions = function(appPermissions, index, callback) {
    addListOperation(appPermissions,index,updateAppPermission,callback);
};

var updateAppPermission = function(appPermission, callback) {
    var userId;
    if(userId)
        userId = appPermission.appUser.userId;
    else
        userId = "(SELECT UserId FROM Users WHERE UserName='" + appPermission.appUser.userName + "' LIMIT 1)";

    appProvider.updatePermissions(appPermission.permissionId, userId, appPermission.groupId, booleanToDatabaseBoolean(appPermission.read), booleanToDatabaseBoolean(appPermission.write), booleanToDatabaseBoolean(appPermission.execute), function(result) {
        if(result.status === appProvider.Statuses.Error)
            logger.error("Error updating log");
        if(callback)
            callback();
    });
};

module.exports = {
    PiDashApp: PiDashApp,
    App: App,
    AppLog: AppLog,
    AppPermission: AppPermission,
    AppUser: AppUser,
    Process: Process,
    ActiveApps: ActiveApps,
    getAppById: getAppById,
    getPiDashAppByAppId: getPiDashAppByAppId,
    getPiDashAppByAppIdExtended: getPiDashAppByAppIdExtended,
    getPiDashAppByDetails: getPiDashAppByDetails,
    getLogsByAppId: getLogsByAppId,
    getAppPermissionsByAppId: getAppPermissionsByAppId,
    getPiDashAppsByUserId: getPiDashAppsByUserId,
    addPiDashApp: addPiDashApp,
    deleteAppByAppId: deleteAppByAppId,
    deleteAppPermissionByPermissionId: deleteAppPermissionByPermissionId,
    deleteAppLogByLogId: deleteAppLogByLogId,
    updatePiDashApp: updatePiDashApp
};