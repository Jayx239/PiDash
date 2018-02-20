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
                data: JSON.stringify(piDashApp)
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


        return serverManagerApi;
    });