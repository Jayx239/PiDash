angular.module('PiDashApp.ServerManagerService',[])
    .service('serverManagerService',function($http){

        /* Variables */
        var serverManagerApi = {};
        var baseUrl = 'localhost:4656';

        /* Methods */
        serverManagerApi.spawnProcess = function(userCommand, callback){
            $.ajax({
                method: "POST",
                url: "/Process/Spawn",
                data: {"Command" : userCommand}
            }).done(function(res){
                if(callback)
                    callback(res);
                return res;
            })
        };

        serverManagerApi.getConsoleByPid = function(userPid, callback) {
            $.ajax({
                method: "POST",
                url: "/Process/Console",
                data: {"pid":userPid}
            }).done(function(res){
                if(callback)
                    callback(res);
                return res;
            })
        };

        serverManagerApi.runCommand = function(pid, command, callback) {
            console.log("Pid " + pid);
            $.ajax({
                method: "POST",
                url: "/Process/Command",
                data: { "pid": pid, "command":command}
            }).done(function(res) {

                    callback(res);
                if(res.Status === "Error") {

                }
            })
        };

        serverManagerApi.killProcess = function(pid,callback) {
            $.ajax({
                method: "POST",
                url: "/Process/Kill",
                data: { "pid": pid}
            }).done(function(res) {

                callback(res);
                if(res.Status === "Error") {

                }
            })
        };

        serverManagerApi.addPiDashApp = function(piDashApp, callback) {
            $.ajax({
                method: "POST",
                url: "/App/AddApp",
                data: {json: JSON.stringify(piDashApp)},
                dataType: 'json'
            }).done(function(res) {
                callback(res);
                if(res.Status === "Error") {

                }
            })
        };

        serverManagerApi.getUser = function(callback) {
            $.ajax({
                method: "POST",
                url: "/LogonRegister/User"
            }).done(function(res) {
                callback(res);
                if(res.Status === "Error") {

                }
            })
        };

        serverManagerApi.getPiDashApp = function(appId ,callback) {
            $.ajax({
                method: "POST",
                url: "/App/GetApp"
            }).done(function(res) {
                callback(res);
                if(res.Status === "Error") {

                }
            })
        };

        serverManagerApi.getPiDashApps = function(callback) {
            $.ajax({
                method: "POST",
                url: "/App/GetAppsByUserId"
            }).done(function(res) {
                callback(res);
                if(res.Status === "Error") {

                }
            })
        };

        serverManagerApi.deletePiDashApp = function(appId, callback) {
            $.ajax({
                method: "POST",
                url: "/App/DeleteAppByAppId",
                data: { "appId": appId}
            }).done(function(res) {
                callback(res);
                if(res.Status === "Error") {

                }
            })
        };

        serverManagerApi.updatePiDashApp = function(piDashApp, callback) {
            $.ajax({
                method: "POST",
                url: "/App/UpdateApp",
                data: {json: JSON.stringify(piDashApp)},
                dataType: 'json'
            }).done(function(res) {
                callback(res);
                if(res.Status === "Error") {

                }
            })
        };


        serverManagerApi.saveScript = function(script, callback) {
            $.ajax({
                method: "POST",
                url: "/App/SaveScript",
                data: {json: JSON.stringify(script)},
                dataType: 'json'
            }).done(function(res) {
                callback(res);
                if(res.Status === "Error") {

                }
            })
        };

        serverManagerApi.getLogContents = function(log, callback) {
            $.ajax({
                method: "POST",
                url: "/App/GetLogContents",
                data: {json: JSON.stringify(log)},
                dataType: 'json'
            }).done(function(res) {
                callback(res);
                if(res.Status === "Error") {

                }
            })
        };

        serverManagerApi.deleteAppPermissionByPermissionId = function(permissionId, appId, callback) {
            $.ajax({
                method: "POST",
                url: "/App/DeleteAppPermissionByPermissionId",
                data: {permissionId:permissionId, appId: appId },
                dataType: 'json'
            }).done(function(res) {
                callback(res);
                if(res.Status === "Error") {

                }
            })
        };

        serverManagerApi.deleteAppLogByLogId = function(logId, appId, callback) {
            $.ajax({
                method: "POST",
                url: "/App/DeleteAppLogByLogId",
                data: {logId : logId, appId: appId },
                dataType: 'json'
            }).done(function(res) {
                callback(res);
                if(res.Status === "Error") {

                }
            })
        };

        serverManagerApi.startPiDashApp = function(piDashApp, callback) {
            $.ajax({
                method: "POST",
                url: "/App/StartPiDashApp",
                data: {json: JSON.stringify(piDashApp)},
                dataType: 'json'
            }).done(function(res) {
                callback(res);
            })
        };

        return serverManagerApi;
    });