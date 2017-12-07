angular.module('PiDashApp.MemoryMonitorService',[])
    .service('memoryMonitorService',function($http){

        /* Variables */
        var memoryMonitorAPI = {};
        var baseUrl = 'localhost:4656';

        /* Methods */
        memoryMonitorAPI.getMemory = function(){
            return $http({
                method: 'GET',
                url: '/App/System/Memory'
            })
        };

        return memoryMonitorAPI;
    });