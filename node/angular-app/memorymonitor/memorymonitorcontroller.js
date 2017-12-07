angular.module('PiDashApp.MemoryMonitorController',[])
    .controller('memoryMonitorController',function($scope, $interval, memoryMonitorService){
        var refreshRate = 1000; // ms, TODO: abstract this
        $scope.freeMemory = 0;
        $scope.totalMemory = 0;
        $scope.memoryUsage = 0;

        $interval(function(){memoryMonitorService.getMemory().then(function(response){
            if(response) {
                /*
                console.log(response.data.memory.free);
                console.log(response.data.memory.total);
                console.log(response.data.memory.usage * 100);
                * */
                $scope.freeMemory = response.data.memory.free;
                $scope.totalMemory = response.data.memory.total;
                $scope.memoryUsage = response.data.memory.usage*100;
            }
        });},refreshRate);
    });