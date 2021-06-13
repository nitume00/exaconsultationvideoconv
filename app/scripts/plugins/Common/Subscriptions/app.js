/*globals $:false */
'use strict';
/**
 * @ngdoc overview
 * @name adlawApp
 * @description
 * # abs
 *
 * Main module of the application.
 */
angular.module('abs.Common.Subscriptions', [
    'ngResource'
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
    $stateProvider.state('SubscribePlans', {
        url: '/subscribe/plans?error_code',
        controller: 'SubscribePlansController',
        templateUrl: 'scripts/plugins/Common/Subscriptions/views/default/subscribe_plans.html'
    });
});
