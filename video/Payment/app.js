/*globals $:false */
'use strict';
/**
 * @ngdoc overview
 * @name adlawApp
 * @description
 * # adlawApp
 *
 * Main module of the application.
 */
angular.module('abs.Common.Payment', [
    'ngResource',
    'ngSanitize',
    'satellizer',
    'ngAnimate',
    'ui.router'
  ]).config(function($stateProvider, $urlRouterProvider) {
    var getToken = {
        'TokenServiceData': function(TokenService, $q) {
            return $q.all({
                AuthServiceData: TokenService.promise,
                SettingServiceData: TokenService.promiseSettings
            });
        }
    };
    $urlRouterProvider.otherwise('/');
    $stateProvider.state('AppointmentPayment', {
      url: '/appointments/order/:id',
      templateUrl: 'scripts/plugins/Common/Payment/views/appointment_payment.html',
      controller: 'AppointmentPaymentController',
      resolve: getToken
    });
});
