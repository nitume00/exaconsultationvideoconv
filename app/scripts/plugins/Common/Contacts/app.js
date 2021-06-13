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
angular.module('abs.Common.Contacts', [
    'ui.router',
    'ngResource',
    'angulartics',
    'angulartics.google.analytics',
    'angulartics.facebook.pixel'
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
        $stateProvider.state('contact', {
                url: '/contactus',
                templateUrl: 'scripts/plugins/Common/Contacts/views/default/contacts.html',
				controller: 'ContactUsController',
                resolve: getToken
            });
    });
