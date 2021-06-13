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
angular.module('abs.Clinic.Pharmacy', [
    'ngResource',
    'ngSanitize',
    'satellizer',
    'ngAnimate',
    'ui.bootstrap',
    'ui.router',
    'angular-growl',
    'google.places',
    'ngCookies',
    'angular-md5',
    'ui.select',
    'angulartics',
    'pascalprecht.translate',
    'angulartics.google.analytics',
    'tmh.dynamicLocale',
    'ngMap',
    'chieffancypants.loadingBar',
    'angularMoment',
    'ngFileUpload',
    'slugifier',
    'ngTagsInput'
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
        $stateProvider.state('prescriptions', {
                url: '/prescriptions',
                templateUrl: 'scripts/plugins/Clinic/Clinic/views/default/clinic_profile.html',
                controller: 'ClinicController',
                resolve: getToken
            }).state('pharmacy_view', {
                url: '/pharmacy/:id/:slug',
                templateUrl: 'scripts/plugins/Clinic/Pharmacy/views/default/pharmacy_profile.html',
                resolve: getToken
            });
    });
