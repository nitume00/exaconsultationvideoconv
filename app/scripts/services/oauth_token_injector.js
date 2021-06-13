'use strict';
/**
 * @ngdoc service
 * @name abs.oauthTokenInjector
 * @description
 * # sessionService
 * Factory in the abs.
 */
angular.module('abs')
    .factory('oauthTokenInjector', function($cookies) {
        var oauthTokenInjector = {
            request: function(config) {
                config.headers['x-ag-app-id'] = '4542632501382585';
                config.headers['x-ag-app-secret'] = '3f7C4l1Y2b0S6a7L8c1E7B3Jo3';
                if (config.url.indexOf('.html') === -1) {
                    if ($cookies.get("token") !== null && angular.isDefined($cookies.get("token"))) {
                        config.headers.Authorization = 'Bearer ' +$cookies.get("token");
                   }
                }
                return config;
            }
        };
        return oauthTokenInjector;
    });