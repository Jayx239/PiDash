angular.module('PiDashApp.ServerManagerController',[])
    .controller('serverManagerController',function($scope, $interval, serverManagerService){
        var refreshRate = 1000; // ms, TODO: abstract this
        $scope.processes = [];
        $scope.apps = [];

        $scope.activeApp = [];
        $scope.activeAppIndex = 0;
        $scope.command = "";
        $scope.startAppButtonText = "Start App";
        var Statuses = {"Starting":"Starting","Running":"Running","Stopped":"Stopped"};
        var MessageSourceTypes = {"Out": "stdout", "In":"stdin","Error":"stderr","Close": "close"};
        $interval(function(){
            if($scope.apps.length > 0) {
                $scope.refreshConsole($scope.activeApp);
            }
            },refreshRate);



        $scope.setActiveApp = function(index) {
            $scope.activeApp = $scope.apps[index];
        };

        $scope.addApplication = function() {
            if($scope.activeApp)
               $scope.activeApp = angular.copy($scope.activeApp);
            $scope.activeApp.appName = "New App";
            $scope.activeApp.status = Statuses.Stopped;
            $scope.apps.push($scope.activeApp);
            /*$scope.apps.push(angular.copy($scope.activeApp));*/
            console.log($scope.apps.length + " " + $scope.activeApp.appName);
        };

        $scope.saveApplication = function() {
            $scope.apps.push(angular.copy($scope.activeApp));
        };

        $scope.refreshApps = function() {
            $scope.refreshConsoles();
        };

        $scope.refreshConsoles = function() {
            for(var app in $scope.apps) {
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
                        $scope.startAppButtonText = "Start App";
                    }
                    else {
                        app.status = Statuses.Running;
                        $scope.startAppButtonText = "Stop App";
                    }

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
                output += messages[i].Message + "\n";
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

        $scope.toggleActiveAppStart = function() {
            if($scope.activeApp.status === Statuses.Stopped) {
                $scope.startActiveApp();
                $scope.startAppButtonText = "Stop App";

            }
            else {
                $scope.stopActiveApp();
                $scope.startAppButtonText = "Start App";
            }
        };

        $scope.startActiveApp = function(){
            spawnProcess($scope.activeApp);

        };

        $scope.stopActiveApp = function(){
            $scope.killApp($scope.activeApp);
        };

        $scope.killApp = function(app) {
            serverManagerService.killProcess(app.pid,function() {
                $scope.refreshConsole(app);
            });
        }

    });