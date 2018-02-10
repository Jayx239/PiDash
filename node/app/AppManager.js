const process = require('./Process');
const appProvider = require("./AppProvider");

/* Data Structures */
function PiDashApp(app,appLog,appPermissions, processes) {
    this.app = app;
    this.appLog = appLog;
    this.appPermissions = appPermissions;
    this.processes = processes;
}

function App(name, appId, startCommand) {
        this.name = name;
        this.appId = appId;
        this.startCommand = startCommand;
}

App.prototype.setLogs = function(logs) {
    this.logs = logs;
};

function AppLog(path,name) {
    this.path = path;
    this.name = name;
}


function AppPermission(appUser, isAdmin) {
    this.appUser = appUser;
    this.admin = isAdmin;
}

function AppUser(userName, userId) {
    this.userName = userName;
    this.userId = userId;
}

function Process(pid) {
    this.pid = pid;
    this.startTime = Date.now();
}

Process.prototype.stopProcess = function(){
    this.endTime = Date.now();
};

Process.prototype.getUpTime = function(){
  if(this.endTime)
      return this.endTime - this.startTime;
  else
      return Date.now() - this.startTime;
};

/* Process management functions */
ActiveApps = [];

var getAppById = function(appId, callback) {

    if(ActiveApps[appId]) {
        callBack(ActiveApps[appId]);
        return;
    }
    appProvider.getAppByAppId(appId,function(result) {
        if(result.status === appProvider.Statuses.Error || result.results.length < 1) {
            callback(null);
        }
        else {
            var app = new App(result.firstResult.AppName, result.firstResult.AppId, result.firstResult.StartCommand);
            callback(app);
        }
    });
};

var getPiDashAppById = function(appId, callback) {
    if(ActiveApps[appId]) {
        callBack(ActiveApps[appId]);
    }
    else {
        getAppById(appId,function(app) {
            if(!app) {
                callback(app);
                return;
            }
            getLogsByAppId(appId,function(logs) {
                getAppPermissionsByAppId(appId,function(permissions) {
                    var newApp = new PiDashApp(app,logs,permissions,[]);
                    ActiveApps[appId] = newApp;
                    callback(ActiveApps[appId]);
                })
            })
        });
    }
};

var getLogsByAppId = function(appId, callback) {
    appProvider.getLogsByAppId(appId,function(result) {
        if(result.status === appProvider.Statuses.Error) {
            callback([]);
            return;
        }

        logs = [];
        for(var i=0; i<result.results.length; i++) {
            var log = new AppLog(result.results[i].Path,result.results[i].LogName);
            logs.push(log);
        }
        callback(logs);

    });
};

var getAppPermissionsByAppId = function(appId, callback) {
    appProvider.getPermissionsByAppId(appId, function(result) {

        var appPermissions = [];
        for(var i=0; i<result.results.length; i++) {
            var appPermission = AppPermission(result.results[i]);
            appPermissions.push(appPermission);
        }

        return appPermissions;
    });
};

module.exports = {
    PiDashApp: PiDashApp,
    App: App,
    AppLog: AppLog,
    AppPermission: AppPermission,
    AppUser: AppUser,
    Process: Process,
    getAppById: getAppById,
    getPiDashAppById: getPiDashAppById
};