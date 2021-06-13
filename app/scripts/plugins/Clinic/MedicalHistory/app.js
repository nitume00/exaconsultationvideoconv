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
angular.module('abs.Clinic.MedicalHistory', [
    'ngResource',
    'ngSanitize',
    'satellizer',
    'ngAnimate',
    'ui.router',
    'oitozero.ngSweetAlert',
    'uiSwitch'
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
        $stateProvider.state('MedicalHistory', {
                url: '/medical_history/:id/:slug?info',
                templateUrl: 'scripts/plugins/Clinic/MedicalHistory/views/default/medical_history.html',
                controller: 'MedicalHistoryController',
                resolve: getToken
            }).state('MedicalHistoryAdd', {
                url: '/medical_history/add/:id/:slug?info',
                templateUrl: 'scripts/plugins/Clinic/MedicalHistory/views/default/medical_history_add.html',
				        controller: 'MedicalHistoryController',
                resolve: getToken
            }).state('MedicalHistoryEdit', {
                url: '/medical_history/edit/:id',
                templateUrl: 'scripts/plugins/Clinic/MedicalHistory/views/default/medical_history_edit.html',
                controller: 'MedicalHistoryController',
                resolve: getToken
            }).state('MedicalHistoryView', {
                url: '/medical_history/view/:user_id',
                templateUrl: 'scripts/plugins/Clinic/MedicalHistory/views/default/medical_history_view.html',
                controller: 'MedicalHistoryController',
                resolve: getToken
            }).state('MedicalRecordView', {
                url: '/users/medical_record/view/:user_id/:specialty_id/:appointment_id',
                templateUrl: 'scripts/plugins/Clinic/MedicalHistory/views/default/medical_record_view.html',
                controller: 'MedicalHistoryController',
                resolve: getToken
            });
});