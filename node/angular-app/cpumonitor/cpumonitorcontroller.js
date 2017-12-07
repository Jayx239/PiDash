angular.module('PiDashApp.CpuMonitorController',[])
    .controller('cpuMonitorController',function($scope, $interval, cpuMonitorService){
        var refreshRate = 1000; // ms, TODO: abstract this
        $scope.cpuCores = {};

        $interval(function(){cpuMonitorService.getCpus().then(function(response){
            if(response) {
                $scope.cpuCores = response.data;
            }
        });},refreshRate);
    });