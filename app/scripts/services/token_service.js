'use strict';
/**
 * @ngdoc service
 * @name abs.sessionService
 * @description
 * # sessionService
 * Factory in the abs.
 */
angular.module('abs')
    .service('TokenService', function($rootScope, $http, $window, $q, $cookies, $state) {
        //jshint unused:false
        var promise;
        var promiseSettings;
        var deferred = $q.defer();
        if ($cookies.get("token") === null || angular.isUndefined($cookies.get("token"))) {
            
        } else {
            promise = true;
        }
        if (angular.isUndefined($rootScope.settings)) {
            $rootScope.settings = {};
            var params = {};
            params.filter = '{"fields":{"name":true,"value":true},"limit":200,"skip":0}';
            promiseSettings = $http({
                    method: 'GET',
                    url: '/api/v1/settings',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    params: params
                })
                 .success(function(response) {
                    if (angular.isDefined(response.data)) {
                        var settings = {};
                        angular.forEach(response.data, function(value, key) {
                            //jshint unused:false
                            $rootScope.settings[value.name] = value.value;
                        });
                    }
                });
        } else {
            promiseSettings = true;
        }
        return {
            promise: promise,
            promiseSettings: promiseSettings
        };
    });
