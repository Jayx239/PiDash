angular.module('PiDashApp.CpuMonitorService',[])
    .service('cpuMonitorService',function($http){

        /* Variables */
        var cpuMonitorAPI = {};
        var baseUrl = 'localhost:4656';

        /* Methods */
        cpuMonitorAPI.getCpus = function(){
            return $http({
                method: 'GET',
                url: '/App/System/GetCpus'
            })
        };

        return cpuMonitorAPI;
    });