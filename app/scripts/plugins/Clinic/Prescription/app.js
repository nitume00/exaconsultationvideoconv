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
angular.module('abs.Clinic.Prescription', [
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
        $stateProvider.state('PrescriptionAdd', {
                url: '/appointment/{id}/prescription/add',
                templateUrl: 'scripts/plugins/Clinic/Prescription/views/default/prescription_add.html',
                controller: 'PrescriptionController',
                resolve: getToken
            }).state('prescription_view', {
                url: '/prescription/:id/:appointment_token',
                templateUrl: 'scripts/plugins/Clinic/Prescription/views/default/prescription_view.html',
                controller: 'PrescriptionController',
                resolve: getToken
            }).state('me_prescriptions', {
                url: '/me/prescriptions',
                templateUrl: 'scripts/plugins/Clinic/Prescription/views/default/prescriptions.html',
                controller: 'PrescriptionController',
                resolve: getToken
            });
    });
