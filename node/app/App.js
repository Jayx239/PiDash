const appManager = require('./AppManager');
const server = require('./Server');
const piDashApp = require('../content/js/PiDashApp');
const validation = require('./Validation');
const app = server.app;


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

        }
    }
    else {
        result.status = "error";
        res.json(result);
    }
});

app.post("/App/GetApp", validation.requireAdmin, function(req,res) {

    var app = new appManager.App("App 1",0,3,"dir",[]);
    var permission = new appManager.AppPermission(0,new appManager.AppUser("admin",0),"Jayx239",true,0,true,true,true);

    var piDashApp = new appManager.PiDashApp(app,[permission],[]);

    res.json(JSON.stringify(piDashApp));
});

app.post("/App/GetAppsByUserId", validation.requireAdmin, function(req,res) {
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

var createAppFromRequest = function(req) {
    var jsonReq = JSON.parse(req.body.json);
    //jsonReq.app.creatorUserId = req.userId;
    //console.log(JSON.stringify(jsonReq));
    //console.log(jsonReq.app);

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