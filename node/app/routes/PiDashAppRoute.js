const appManager = require('../AppManager');
const server = require('../Server');
const piDashApp = require('../../content/js/PiDashApp');
const validation = require('../Validation');
const app = server.app;
const script = require("../../content/js/Script");
const fs = require('fs');
const process = require('../Process');
/*
    App.json
    {
        PiDashApp: {
            App: {
                name: "",
                appId: "",
                creatorUserId: "",
                startCommand: "",
                logs: [
                    0: {
                        logId: "",
                        appId: "",
                        path: "",
                        name: ""
                    }
                ]
            },
            permissions: {
                permissionId: "",
                appId: "",
                appUser: "",
                admin: "",
                groupId: "",
                read: "",
                write: "",
                execute: ""
            },
            processes: [
                0: {
                    pid: "",
                    startTime: ""
                }
            ]
        }


*/

app.post("/App/AddApp", validation.requireLogon, function(req,res) {
    //console.log(req);
    var piDashApp = createAppFromRequest(req);
    var result = new Object();
    if(piDashApp) {
        /* Apps with appId > 0 should already exist in database */
        if(piDashApp.app.appId > 0) {
            result.status = "error";
            result.message = "App already exists";
            res.json(result);
            return;
        }

        if (!piDashApp.app.creatorUserId || piDashApp.app.creatorUserId === '') {
            piDashApp.creatorUserId = req.userId;
        }

        if (piDashApp.appPermissions.length < 1) {
            createDefaultPermissions(req.userId, piDashApp.app.appId);
        }

        appManager.addPiDashApp(piDashApp, function (resultApp) {

            if (resultApp) {
                result.app = JSON.stringify(resultApp);
                result.status = "success";
            }
            else {
                result.status = "error";
            }

            res.json(result);
        });
    }
    else {
        result.status = "error";
        res.json(result);
    }
});

app.post("/App/UpdateApp", validation.requireAdmin, function(req,res) {
    var piDashApp = createAppFromRequest(req);
    var result = new Object();
    if(piDashApp) {
        /* Apps with appId < 0 should not already exist in database */
        if(piDashApp.app.appId < 0) {
            result.status = "error";
            result.message = "App does not exist";
            res.json(result);
            return;
        }
        else {
            appManager.updatePiDashApp(piDashApp,function(updatedPiDashApp) {
                result.status = "Unknown";
                result.message = "Validation not yet implemented";
                result.app = JSON.stringify(updatedPiDashApp);
                res.json(result);
            });
        }
    }
    else {
        result.status = "error";
        res.json(result);
    }
});

app.post("/App/GetApp", validation.requireLogon, function(req,res) {

    var app = new appManager.App("App 1",0,3,"dir",[]);
    var permission = new appManager.AppPermission(0,new appManager.AppUser("admin",0),"Jayx239",true,0,true,true,true);

    var piDashApp = new appManager.PiDashApp(app,[permission],[]);

    res.json(JSON.stringify(piDashApp));
});

app.post("/App/GetAppsByUserId", validation.requireLogon, function(req,res) {
    appManager.getPiDashAppsByUserId(req.userId, function(piDashApps) {
        var response = new Object();
        if(piDashApps) {
            response.apps = piDashApps;
            response.status = "success";
        }
        else {
            response.status = "error";
        }
        res.json(JSON.stringify(response));
    });
});

app.post("/App/DeleteAppByAppId", validation.requireAdmin, function(req,res) {
    var appId = req.body.appId;
    appManager.deleteAppByAppId(appId,function(result) {
        var result = new Object();

        // TODO: don't hardcode error
        if(result.status === "Error") {
            result.status = "Error";
        }
        else {
            result.status = "Success";
        }
        res.json(result);
    })
});

app.post("/App/DeleteAppPermissionByPermissionId", validation.requireAdmin, function(req,res) {
    var response = new Object();
    appManager.deleteAppPermissionByPermissionId(req.body.permissionId,function(result) {
        if(result.status === "Error") {
            response.status = "Error";
        }
        else {
            /* Clear Cache */
            appManager.getPiDashAppByAppIdExtended(req.body.appId, true, null);
            response.status = "Success";
        }
        res.json(response);
    });
});

app.post("/App/DeleteAppLogByLogId", validation.requireAdmin, function(req,res) {
    var response = new Object();
    appManager.deleteAppLogByLogId(req.body.logId,function(result) {
        if(result.status === "Error") {
            response.status = "Error";
        }
        else {
            /* Clear Cache */
            appManager.getPiDashAppByAppIdExtended(req.body.appId, true, null);
            response.status = "Success";
        }
        res.json(response);
    });
});

app.post("/App/SaveScript", function(req,res) {
    var appScript = script.buildScriptFromRequest(req.body);
    var result = Object();
    if(appScript) {
        var path = "./programs/scripts/" + appScript.appName + ".run";
        fs.writeFile(path, appScript.getScriptContents(),function(err) {
            if(err) {
                result.status = "Error";
            }
            else {
                fs.chmod(path,fs.constants.S_IRUSR|fs.constants.S_IWUSR|fs.constants.S_IXUSR,function(err){
                    if(err)
                        result.status = "Error";
                    else
                        result.status = "Success";
                });
            }
            res.json(result);
        });
    }
    else {
        result.status = "Error";
        result.message = "Invalid script details";
        res.json(result)
    }
});

app.post("/App/GetLogContents", function(req,res) {
    var appLog = piDashApp.tryParseJson(req.body.log);

    var result = new Object();
    if(appLog) {
        fs.readFile(appLog.path, 'utf-8', function (err, contents) {
            if(err) {
                result.status = "Error";
            }
            else {
                result.status = "Success";
                result.logContents = contents;
            }
            res.json(result);
        });
    }
    else {
        result.status = "Error";
        result.message = "Invalid log data received";
        res.json(result);
    }
});

app.post("/App/StartPiDashApp", function(req,res) {
    var newPiDashApp = createAppFromRequest(req);
    var response = new Object();
    process.spawnProcess(newPiDashApp.app.startCommand,function(newProcess) {
        if(!appManager.ActiveApps[newPiDashApp.app.appId]) {
            appManager.ActiveApps[newPiDashApp.app.appId] = newPiDashApp;
            response.message="Added PiDashApp";
        }

        response.status="Success";
        appManager.ActiveApps[newPiDashApp.app.appId].process = new piDashApp.PiDashProcess(newProcess.pid,newProcess.startTime,newProcess.messages);
        appManager.ActiveApps[newPiDashApp.app.appId].pid = newProcess.pid;
        response.piDashApp = JSON.stringify(appManager.ActiveApps[newPiDashApp.app.appId]);
        res.json(JSON.stringify(response));
    });
});

var createAppFromRequest = function(req) {
    var jsonReq = JSON.parse(req.body.json);

    var app = piDashApp.buildAppFromResponse(jsonReq);
    var permissions;
    var processes;

    if(jsonReq.appPermissions)
        permissions = piDashApp.buildPermissionsFromResponse(jsonReq);
    else
        permissions = [createDefaultPermissions(req.user,app.appId)];

    if(jsonReq.processes)
        processes = piDashApp.buildProcessesFromResponse(jsonReq);
    else
        processes = [];

    var dashApp = new piDashApp.PiDashApp(app,permissions,processes);

    return dashApp;
};

var createDefaultPermissions = function(userId, appId) {
    var defaultPermission = new piDashApp.AppPermission(0,appId,userId,true,0,true,true,true);
    return defaultPermission;
};