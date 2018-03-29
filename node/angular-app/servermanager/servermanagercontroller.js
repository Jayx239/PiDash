//var piDashApp = require('../../content/js/PiDashApp');
angular.module('PiDashApp.ServerManagerController',[])
    .controller('serverManagerController',function($scope, $interval, serverManagerService){
        var refreshRate = 1000; // ms, TODO: abstract this
        $scope.processes = [];
        $scope.apps = [];
        $scope.piDashApps = new Object();
        $scope.activeApp = [];
        $scope.activeAppPermissions = [];
        $scope.activeAppLogs = [];
        $scope.activeAppIndex = 0;
        $scope.command = "";
        $scope.startAppButtonText = "Start App";
        $scope.deleteAppButtonText = "Delete App";
        $scope.userId = "";
        $scope.userName = "";
        $scope.appUser;
        $scope.selectedConfigMenu;
        $scope.configMenus = {
            App: 'App',
            Permissions: 'Permissions',
            Log: 'Log'
        };

        $scope.setMenu = function(menuId) {
            $scope.selectedConfigMenu = menuId;
        };

        var maxNewApps = 100;

        var Statuses = {"Starting":"Starting","Running":"Running","Stopped":"Stopped", "Loading": "Loading"};
        var MessageSourceTypes = {"Out": "stdout", "In":"stdin","Error":"stderr","Close": "close"};

        var initialize = function(){
            serverManagerService.getUser(function(res) {
                $scope.userId = res.userId;
                $scope.userName = res.userName;
                $scope.appUser = new AppUser($scope.userName, $scope.userId);
                $scope.retrieveApps();
                $scope.selectedConfigMenu = $scope.configMenus.App;
            })
        };
        initialize();
        $interval(function(){
            if($scope.activeApp.status === Statuses.Running ) {
                $scope.refreshConsole($scope.activeApp);
                if(!$scope.piDashApps[$scope.activeApp.appId].process.isRunning())
                    $scope.activeApp.status = Statuses.Stopped;
            }
            },refreshRate);

        var getNextNewAppId = function() {
            var i;
            for(i=-1; i>-maxNewApps; i--) {
                if($scope.piDashApps[i])
                    continue;
                return i;
            }
            return i;
        };

        $scope.setActiveApp = function(index) {
            $scope.activeApp = $scope.piDashApps[index].app;

            if(!$scope.activeApp.messages)
                $scope.activeApp.messages = [];
            if(!$scope.activeApp.status)
                $scope.activeApp.status = Statuses.Stopped;
            $scope.activeApp.pid = $scope.piDashApps[$scope.activeApp.appId].pid;
            if(!$scope.piDashApps[index].appPermissions)
                $scope.piDashApps[index].appPermissions = [];
            $scope.activeAppPermissions = $scope.piDashApps[index].appPermissions;

            if(!$scope.piDashApps[index].app.logs)
                $scope.piDashApps[index].app.logs = [];

            $scope.activeAppLogs = $scope.piDashApps[index].app.logs;
            if($scope.piDashApps[index].process && $scope.piDashApps[index].process.isRunning())
                $scope.activeApp.status = Statuses.Running;
            else
                $scope.activeApp.status = Statuses.Stopped;
            updateStartButton();
        };

        $scope.addApplication = function() {
            var newPiDashApp = createDefaultPiDashApp($scope.userName, $scope.userId);
            newPiDashApp.app.appId = getNextNewAppId();
            newPiDashApp.app.name = "New App";
            $scope.piDashApps[newPiDashApp.app.appId] = newPiDashApp;
            $scope.setActiveApp(newPiDashApp.app.appId);
            console.log($scope.apps.length + " " + $scope.activeApp.name);
        };

        $scope.deleteActiveApplication = function(){
            serverManagerService.deletePiDashApp($scope.activeApp.appId, function(response) {
                if(response.status === "Success") {
                    deleteActiveAppLocally();
                    alert("App Deleted");
                }
                else
                    alert("Error Deleting App")

            });
        };

        var deleteActiveAppLocally = function() {
            deleteAppLocally($scope.activeApp.appId);
        };

        var deleteAppLocally = function(appId) {
            delete $scope.piDashApps[appId];
        };

        $scope.deleteApplication = function(){
            delete $scope.piDashApps[appId];
        };

        var deleteApplication = function(appId){
            delete $scope.piDashApps[appId];
        };

        $scope.saveApplication = function() {
            $scope.apps.push(angular.copy($scope.activeApp));
        };

        $scope.refreshApps = function() {
            $scope.refreshConsoles();
        };

        $scope.refreshConsoles = function() {
            for(var app in $scope.piDashApps) {
                $scope.refreshConsole(app);
            }
        };

        function isStopped(messages) {
            for(var i=0; i<messages.length; i++) {
                console.log(messages[i].Source);
                if(messages[i].Source ===  MessageSourceTypes.Close)
                    return true;
            }
            return false;
        }

        $scope.refreshConsole = function(app) {
            serverManagerService.getConsoleByPid(app.pid,function (response) {
                if(response.Status !== "Error")
                    app.console = formatMessageOutput(response);

                    if(isStopped(response)) {
                        app.status = Statuses.Stopped;
                    }
                    else {
                        app.status = Statuses.Running;
                    }
                updateStartButton();

            });
        };

        var spawnProcess = function(app) {
            app.status = Statuses.Starting;
            serverManagerService.spawnProcess(app.startCommand,function (response) {
                app.status = Statuses.Running;
                if (response) {
                    app.pid = response.Pid;
                    $scope.refreshConsole(app);
                }
            });
        };

        var formatMessageOutput = function(messages) {
            var output = "";
            for(var i=0; i<messages.length; i++) {
                output += messages[i].Message;
            }
            return output;
        };

        $scope.executeCommand = function(app, command, callback) {
            serverManagerService.runCommand(app.pid,command, callback);
        };

        $scope.executeCommandActive = function() {
            $scope.executeCommand($scope.activeApp,$scope.command,function(response) {
                $scope.refreshConsole($scope.activeApp);
            });
        };

        var updateStartButton = function() {
            if($scope.activeApp.status === Statuses.Running) {
                $scope.startAppButtonText = "Stop App";
            }
            else
                $scope.startAppButtonText = "Start App";
        };

        $scope.toggleActiveAppStart = function() {
            if($scope.activeApp.status === Statuses.Stopped) {
                $scope.startActivePiDashApp();
            }
            else {
                $scope.stopActiveApp();
            }
            updateStartButton();
        };

        $scope.startActiveApp = function() {
            spawnProcess($scope.activeApp);

        };

        $scope.stopActiveApp = function() {
            $scope.killApp($scope.activeApp);
        };

        $scope.killApp = function(app) {
            serverManagerService.killProcess(app.pid,function() {
                $scope.refreshConsole(app);
            });
        };

        $scope.retrieveApps = function() {
            serverManagerService.getPiDashApps(function(res) {
                if(res) {
                        var userApps = buildPiDashAppsFromResponse(res);
                        if(userApps)
                            for( var i in userApps)
                                $scope.piDashApps[userApps[i].app.appId] = userApps[i];
                }
            });
        };

        $scope.addPiDashApp = function() {
            var activePiDashApp = $scope.piDashApps[$scope.activeApp.appId];
            if(activePiDashApp.app.appId <= 0)
                addPiDashApp(activePiDashApp);
            else
                updatePiDashApp(activePiDashApp);
        };

        var addPiDashApp = function(piDashApp) {
            serverManagerService.addPiDashApp(piDashApp, function(res) {
                delete $scope.piDashApps[piDashApp.app.appId];
                var newPiDashApp = buildPiDashAppFromResponse(res.app);
                $scope.piDashApps[newPiDashApp.app.appId] = newPiDashApp;
                $scope.activeApp = newPiDashApp.app;
                alert("App Added!");
            });
        };

        var updatePiDashApp = function(piDashApp) {
            serverManagerService.updatePiDashApp(piDashApp, function(res) {
                if(res.app)
                    $scope.piDashApps[$scope.activeApp.appId] = buildPiDashAppFromResponse(res.app);
                $scope.setActiveApp($scope.activeApp.appId);
            });
        };

        $scope.addActiveAppPermission = function() {
            if(!$scope.activeAppPermissions)
                $scope.activeAppPermissions = [];
            $scope.activeAppPermissions.push(new AppPermission(-1,$scope.activeApp.appId,new AppUser("",-1),-1,false,false,false));
        };

        $scope.deleteActiveAppPermission = function(index) {
            serverManagerService.deleteAppPermissionByPermissionId($scope.piDashApps[$scope.activeApp.appId].appPermissions[index].permissionId, $scope.activeApp.appId, function(){
                $scope.activeAppPermissions.splice(index,1);
            });
        };

        $scope.addActiveAppLog = function() {
            if(!$scope.activeAppLogs)
                $scope.activeAppLogs = [];
            $scope.activeAppLogs.push(new AppLog(-1,$scope.activeApp.appId,"",""));
        };

        $scope.deleteActiveAppLog = function(index) {
            serverManagerService.deleteAppLogByLogId($scope.piDashApps[$scope.activeApp.appId].app.logs[index].id, $scope.activeApp.appId, function(){
                $scope.piDashApps[$scope.activeApp.appId].app.logs.splice(index,1);
            });
        };

        $scope.startActivePiDashApp = function() {
            startPiDashApp($scope.activeApp.appId,function(response){
                console.log(response)
            });
        };

        var startPiDashApp = function(appId, callback) {
            $scope.activeApp.status = Statuses.Starting;
            serverManagerService.startPiDashApp($scope.piDashApps[appId], function(response){

                var piDashAppRes = JSON.parse(response);
                if(piDashAppRes.piDashApp) {
                    var updatedPiDashApp = buildPiDashAppFromResponse(piDashAppRes.piDashApp);
                    if(updatedPiDashApp)
                        $scope.piDashApps[updatedPiDashApp.app.appId] = updatedPiDashApp;
                    $scope.setActiveApp(updatedPiDashApp.app.appId);
                    $scope.activeApp.status = Statuses.Running;
                }
                else if(piDashAppRes.Status === "Error") {

                }
                if(callback)
                    callback(response);
            });
        };
        $scope.resetPermissionUserId = function(appPermission) {
            appPermission.appUser.userId = -1;
        }
    });