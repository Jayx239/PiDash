/* Data Structures */
function PiDashApp(app,appPermissions, piDashProcess) {
    this.app = app;
    this.appPermissions = appPermissions;


    if(piDashProcess){
        this.process = piDashProcess;
        this.pid = piDashProcess.pid;
    }
    else {
        this.process = new PiDashProcess(-1,-1,[]);
        this.process.running = false;
    }
}


PiDashApp.prototype.setAppId = function(appId) {
    this.app.appId = appId;
    for(var i=0; i<this.app.logs.length; i++) {
        this.app.logs[i].appId = appId;
    }
};

function App(name, appId, creatorUserId, startCommand, logs) {
    this.name = name;
    this.appId = appId;
    this.creatorUserId = creatorUserId;
    this.startCommand = startCommand;
    this.logs = logs;
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

function PiDashProcess(pid, startTime, messages) {
    this.pid = pid;
    this.messages = [];
    if(pid && pid >= 0)
        this.running = true;
    else
        this.running = false;

    if(messages) {
        this.messages = messages;
        this.isRunning();
    }

    this.startTime = Date.now();
    if(startTime)
        this.startTime = startTime;

}

PiDashProcess.prototype.isRunning = function(){
    if(this.running)
        for(var message in this.messages) {
            if(message.Source === CLOSE ) {
                this.running = false;
                break;
            }
        }

        return this.running;
};

/* Console signal codes */
var STDIN = "stdin";//0;
var STDOUT = "stdout";//1;
var STDERR = "stderr";//2;
var CLOSE = "close";//3;

function Process(process, startTime) {
    this.process = process;
    this.pid = process.pid;
    this.messages = [];
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

Process.prototype.writeIn = function(input){
    this.process.stdin.write(input);
    this.messages.push(new ProcessMessage(STDIN,input))
};

Process.prototype.writeErr = function(input){
    this.messages.push(new ProcessMessage(STDERR,input))
};

Process.prototype.writeOut = function(input){
    this.messages.push(new ProcessMessage(STDOUT,input))
};

Process.prototype.writeClose = function(input) {
    this.messages.push(new ProcessMessage(CLOSE,input))
};

function ProcessMessage(src,message) {
    this.Source = src;
    this.Message = message;
    this.CreateTime = Date.now();
}

var buildPiDashAppFromResponse = function(res) {

    var jsonRes = tryParseJson(res);

    var app = buildAppFromResponse(jsonRes);
    var permissions;
    var process;

    if(jsonRes.appPermissions)
        permissions = buildPermissionsFromResponse(jsonRes);
    if(jsonRes.process)
        process = new PiDashProcess(jsonRes.process.pid, jsonRes.process.startTime, jsonRes.process.messages);

    var dashApp = new PiDashApp(app,permissions,process);

    if(jsonRes.pid)
        dashApp.pid = jsonRes.pid;



    return dashApp;
};

var buildPiDashAppsFromResponse = function(res) {
    console.log(res);
    var jsonRes = tryParseJson(res);
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

var buildLogsFromResponse = function(res) {
    var logs = [];
    for(var i=0; i<res.app.logs.length; i++) {
        var log = res.app.logs[i];
        logs.push(new AppLog(log.id, res.app.appId, log.path, log.name));
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
    var piDAshApp = new PiDashApp(app,appPermissions, null);
    return piDAshApp;
};

var tryParseJson = function(res) {
    var jsonRes;
    if((typeof res) == 'string')
        jsonRes = JSON.parse(res);
    else
        jsonRes = res;

    return jsonRes;

};
if(typeof module != 'undefined' && module.exports)
    module.exports = {
        PiDashApp: PiDashApp,
        App: App,
        AppLog: AppLog,
        AppPermission: AppPermission,
        AppUser: AppUser,
        PiDashProcess: PiDashProcess,
        Process: Process,
        ProcessMessage: ProcessMessage,
        STDIN: STDIN,
        STDOUT: STDOUT,
        STDERR:STDERR,
        CLOSE:CLOSE,
        buildPiDashAppFromResponse: buildPiDashAppFromResponse,
        buildPiDashAppsFromResponse: buildPiDashAppsFromResponse,
        buildAppFromResponse: buildAppFromResponse,
        buildLogsFromResponse: buildLogsFromResponse,
        buildPermissionsFromResponse: buildPermissionsFromResponse,
        buildProcessesFromResponse: buildProcessesFromResponse,
        createDefaultPiDashApp: createDefaultPiDashApp,
        tryParseJson: tryParseJson
    };