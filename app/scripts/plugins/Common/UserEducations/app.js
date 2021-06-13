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
angular.module('abs.Common.UserEducations', [
   'ui.router',
   'ngResource',
   'mgcrea.ngStrap',
   'oitozero.ngSweetAlert',
   'mwl.calendar',
   'ui.bootstrap'   
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
    $urlRouterProvider.otherwise('/');
    $stateProvider.state('user_educations', {
            url: '/user/education',
            templateUrl: 'scripts/plugins/Common/UserEducations/views/default/user_educations.html',
            controller: 'UserEducationsController',
            resolve: getToken
    });
});