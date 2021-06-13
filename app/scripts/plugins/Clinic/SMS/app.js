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
angular.module('abs.Clinic.SMS', [
    'ngResource',
    'ngSanitize',
    'satellizer',
    'ngAnimate',
    'ui.router'
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
    $stateProvider.state('SendSMS', {
        url: '/sms_nofication/{branch_id}/{clinic_user_id}/send',
        templateUrl: 'scripts/plugins/Clinic/SMS/views/default/sms_notifications.html',
        controller: 'SmsController',
        resolve: getToken
    }); 
 });  