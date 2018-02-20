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
    console.log(req);
    var piDashApp = createAppFromRequest(req);
    var result = [];
    if(piDashApp) {
        if (!piDashApp.app.creatorUserId || piDashApp.creatorUserId === '') {
            piDashApp.creatorUserId = req.userId;
        }

        if (piDashApp.appPermissions.length < 1) {
            createDefaultPermissions(req.userId, piDashApp.app.appId);
        }

        appManager.addPiDashApp(piDashApp, function (resultApp) {

            if (resultApp) {
                result.app = JSON.stringify(result);
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

app.post("/App/GetApp",function(req,res) {

    var app = new appManager.App("App 1",0,"admin","dir",[]);
    var permission = new appManager.AppPermission(0,new appManager.AppUser("admin",0),"Jayx239",true,0,true,true,true);

    var piDashApp = new appManager.PiDashApp(app,[permission],[]);

    res.json(JSON.stringify(piDashApp));
});

var createAppFromRequest = function(req) {
    console.log(req.body);
    return piDashApp.buildPiDashAppFromResponse(req.body);
};

var createDefaultPermissions = function(userId, appId) {
    var defaultPermission = new piDashApp.AppPermission(0,appId,userId,true,0,true,true,true);
};