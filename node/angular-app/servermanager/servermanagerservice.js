angular.module('PiDashApp.ServerManagerService',[])
    .service('serverManagerService',function($http){

        /* Variables */
        var serverManagerApi = {};
        var baseUrl = 'localhost:4656';

        /* Methods */
        serverManagerApi.spawnProcess = function(userCommand, callBack){
            $.ajax({
                method: "POST",
                url: "/Process/Spawn",
                data: {"Command" : userCommand}
            }).done(function(res){
                if(callBack)
                    callBack(res);
                return res;
            })
        };

        serverManagerApi.getConsoleByPid = function(userPid, callBack) {
            $.ajax({
                method: "POST",
                url: "/Process/Console",
                data: {"pid":userPid}
            }).done(function(res){
                if(callBack)
                    callBack(res);
                return res;
            })
        };

        serverManagerApi.runCommand = function(pid, command, callBack) {
            console.log("Pid " + pid);
            $.ajax({
                method: "POST",
                url: "/Process/Command",
                data: { "pid": pid, "command":command}
            }).done(function(res) {

                    callBack(res);
                if(res.Status === "Error") {

                }
            })
        };

        serverManagerApi.killProcess = function(pid,callBack) {
            $.ajax({
                method: "POST",
                url: "/Process/Kill",
                data: { "pid": pid}
            }).done(function(res) {

                callBack(res);
                if(res.Status === "Error") {

                }
            })
        };


        return serverManagerApi;
    });