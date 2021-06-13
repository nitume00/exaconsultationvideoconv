/*globals $:false */
'use strict';
/**
 * @ngdoc overview
 * @name abs
 * @description
 * # abs
 *
 * Main module of the application.
 */
angular.module('abs.Common.UserFavorites', [
    'ui.router',
    'ngResource',
    'oitozero.ngSweetAlert'
])
.config(function($stateProvider, $urlRouterProvider) {
    var getToken = {
        'TokenServiceData': function(TokenService, $q) {
            return $q.all({
                AuthServiceData: TokenService.promise,
                SettingServiceData: TokenService.promiseSettings
            });
        }
    };
});
