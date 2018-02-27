/* Data Structures */
function PiDashApp(app,appPermissions, processes) {
    this.app = app;
    this.appPermissions = appPermissions;
    this.processes = processes;
}


PiDashApp.prototype.setAppId = function(appId) {
    this.app.appId = appId;
};

function App(name, appId, creatorUserId, startCommand, logs) {
    this.name = name;
    this.appId = appId;
    this.creatorUserId = creatorUserId;
    this.startCommand = startCommand;
    this.logs = logs
}

App.prototype.setLogs = function(logs) {
    this.logs = logs;
};

function AppLog(logId, appId, path, name) {
    this.id = logId;
    this.appId = appId;
    this.path = path;
    this.name = name;
}


function AppPermission(permissionId, appId, appUser, groupId, read, write, execute) {
    this.permissionId = permissionId;
    this.appId = appId;
    this.appUser = appUser;
    this.groupId = groupId;
    this.read = read;
    this.write = write;
    this.execute = execute;
}

function AppUser(userName, userId) {
    this.userName = userName;
    this.userId = userId;
}

function Process(pid, startTime) {
    this.pid = pid;
    this.startTime = Date.now();
    if(startTime)
        this.startTime = startTime;

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

var buildPiDashAppFromResponse = function(res) {

    console.log(res);
    var jsonRes;
    if(typeof res === 'object')
        jsonRes = res;
    else
        jsonRes = JSON.parse(res);

    var app = buildAppFromResponse(jsonRes);
    if(res.appPermissions)
        var permissions = buildPermissionsFromResponse(jsonRes);
    if(res.processes)
        var processes = buildProcessesFromResponse(jsonRes);
    var dashApp = new PiDashApp(app,permissions,processes);

    return dashApp;
};

var buildPiDashAppsFromResponse = function(res) {
    console.log(res);
    var jsonRes = JSON.parse(res);
    var piDashApps = new Object();
    for(var i=0; i<jsonRes.apps.length; i++) {
        var piDashApp = buildPiDashAppFromResponse(jsonRes.apps[i]);
        piDashApps[piDashApp.app.appId] = piDashApp;
    }
    return piDashApps;
};

var buildAppFromResponse = function(res) {
    if(res) {
        var logs = buildLogsFromResponse(res);
        var app = new App(res.app.name, res.app.appId,res.app.creatorUserId,res.app.startCommand,logs);
        return app;
    }
    else {
        return null;
    }

};

var buildLogsFromResponse = function(res){
    var logs = [];
    for(var i=0; i<res.app.logs.length; i++) {
        var log = res.app.logs[i];
        logs.push(new AppLog(log.logId, res.app.appId, log.path, log.name));
    }
    return logs;
};

var buildPermissionsFromResponse = function(res) {
    var permissions = [];
    for(var i=0; i <res.appPermissions.length; i++){
        var permission = res.appPermissions[i];
        if(permission && permission.appUser)
            permissions.push(new AppPermission(permission.permissionId, res.app.appId, new AppUser(permission.appUser.userName, permission.appUser.userId), permission.groupId, permission.read, permission.write, permission.execute));
    }
    return permissions;
};

var buildProcessesFromResponse = function(res) {
    var processes = [];

    for(var i=0; i<res.processes.length; i++) {
        var process = res.processes[i];
        processes.push(new Process(process.pid,process.startTime));
    }
    return processes;
};

var createDefaultPiDashApp = function(userName, userId) {
    var app = new App("",-1,userId,"",[]);
    var appUser = new AppUser(userName, userId);
    var appPermissions = [new AppPermission(-1, -1, appUser, -1, true, true, true)];
    var piDAshApp = new PiDashApp(app,appPermissions, new Object());
    return piDAshApp;
};

module.exports = {
    PiDashApp: PiDashApp,
    App: App,
    AppLog: AppLog,
    AppPermission: AppPermission,
    AppUser: AppUser,
    Process: Process,
    buildPiDashAppFromResponse: buildPiDashAppFromResponse,
    buildPiDashAppsFromResponse: buildPiDashAppsFromResponse,
    buildAppFromResponse: buildAppFromResponse,
    buildLogsFromResponse: buildLogsFromResponse,
    buildPermissionsFromResponse: buildPermissionsFromResponse,
    buildProcessesFromResponse: buildProcessesFromResponse,
    createDefaultPiDashApp: createDefaultPiDashApp
};