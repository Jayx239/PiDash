const process = require('./Process');
const appProvider = require("./AppProvider");
const logger = require('./Logger').logger;
const piDashApp = require('../content/js/PiDashApp');

/* Import from shared files */
var PiDashApp = piDashApp.PiDashApp;
var App = piDashApp.App;
var AppLog = piDashApp.AppLog;
var AppPermission = piDashApp.AppPermission;
var AppUser = piDashApp.AppUser;
var Process = piDashApp.Process;


/* Process management functions */
ActiveApps = [];

var getAppById = function(appId, callback) {

    if(ActiveApps[appId]) {
        callback(ActiveApps[appId]);
        return;
    }
    appProvider.getAppByAppId(appId,function(result) {
        if(result.status === appProvider.Statuses.Error || result.results.length < 1 || result.firstResult.Active[0] == 0) {
            callback(null);
        }
        else {
            var app = new App(result.firstResult.AppName, result.firstResult.AppId, result.firstResult.CreatorUserId, result.firstResult.StartCommand);
            callback(app);
        }
    });
};

var getPiDashAppByAppId = function(appId, callback) {
    if(ActiveApps[appId]) {
        callback(ActiveApps[appId]);
        return;
    }
    else {
        getAppById(appId,function(app) {
            if(!app) {
                if(callback)
                    callback(app);
                return;
            }
            getLogsByAppId(appId,function(logs) {
                app.setLogs(logs);
                getAppPermissionsByAppId(appId,function(permissions) {

                    var newApp = new PiDashApp(app,permissions,[]);
                    ActiveApps[appId] = newApp;
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
            callback(null);
            return;
        }
        else if(result.firstResult.Active[0] == 0) {
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
            callback([]);
            return;
        }

        logs = [];
        for(var i=0; i<result.results.length; i++) {
            var log = new AppLog(result.results[i].LogId, result.results[i].AppId, result.results[i].Path,result.results[i].LogName);
            logs.push(log);
        }
        callback(logs);

    });
};

var getAppPermissionsByAppId = function(appId, callback) {
    appProvider.getPermissionsByAppId(appId, function(result) {

        var appPermissions = [];
        for(var i=0; i<result.results.length; i++) {
            var user;
            // TODO: implement logic for getting AppUser from userId
            if(result.results[i].UserId)
                user = getAppUserByUserId(result.results[i].UserId);
            var appPermission = new AppPermission(result.results[i].PermissionId,result.results[i].AppId, user, result.results[i].GroupId, result.results[i].ReadPermission, result.results[i].WritePermission, result.results[i].ExecutePermission);
            appPermissions.push(appPermission);
        }

        if(callback)
            callback(appPermissions);
    });
};

// TODO: implement logic for getting full AppUser
var getAppUserByUserId = function(userId) {
    return new piDashApp.AppUser(null,userId);
};

var getPiDashAppsByUserId = function(userId, callback) {
    appProvider.getAppsByCreatorUserId(userId, function(results) {
        var piDashAppIds = [];
        if(results.results.length > 0) {
            for(var i=0; i<results.results.length; i++) {
                if(results.results[i].Active[0] == 1)
                    piDashAppIds.push(results.results[i].AppId);
            }
            var piDashApps = [];
            getPiDashAppsByAppIds(piDashAppIds, function(piDashApps) {
                callback(piDashApps);
            });
        }
        else
            callback([]);
    })
};
var getPiDashAppsByAppIds = function(piDashAppIds, callback) {
    var outputList = [];
    createListOperation(piDashAppIds, 0, getPiDashAppByAppId, outputList, function(piDashApps) {
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
        if(result.Status === appProvider.Statuses.Error)
            logger.error("Error adding app to db");
        if(callback)
            callback();
    });
};

var addLog = function(log, callback) {
    appProvider.addLogs(log.appId,log.path,log.name,function(result) {
        if(result.Status === appProvider.Statuses.Error)
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
        callback();
        return;
    }



    var groupId = appPermission.groupId;
    var userId = appPermission.appUser.userId;

    appProvider.addPermissions(appPermission.appId, userId, appPermission.groupId, booleanToDatabaseBoolean(appPermission.read), booleanToDatabaseBoolean(appPermission.write),booleanToDatabaseBoolean(appPermission.execute), function(result){
        if(result.firstResult === appProvider.Statuses.Error)
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

var deleteAppByAppId = function(appId, callback) {
    delete ActiveApps[appId];
    appProvider.deleteAppByAppId(appId,callback);

};

var deleteAppPermissionByPermissionId = function(permissionId, callback) {
    appProvider.deleteAppPermissionByPermissionId(permissionId,callback)
};

var deleteAppLogByLogId = function(logId, callback) {
    appProvider.deleteAppLogByLogId(logId,callback);
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
    getPiDashAppByDetails: getPiDashAppByDetails,
    getLogsByAppId: getLogsByAppId,
    getAppPermissionsByAppId: getAppPermissionsByAppId,
    getPiDashAppsByUserId: getPiDashAppsByUserId,
    addPiDashApp: addPiDashApp,
    deleteAppByAppId: deleteAppByAppId,
    deleteAppPermissionByPermissionId: deleteAppPermissionByPermissionId,
    deleteAppLogByLogId: deleteAppLogByLogId
};