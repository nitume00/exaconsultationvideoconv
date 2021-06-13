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
angular.module('abs.Clinic.DiagnosticCenter', [
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
        $stateProvider.state('diagnostic_profile', {
                url: '/diagnostic/:id/:slug',
                templateUrl: 'scripts/plugins/Clinic/DiagnosticCenter/views/default/diagnostic_profile.html',
                controller: 'DiagnosticController',
                resolve: getToken
            }).state('diagnostic_branches', {
                url: '/diagnostic/branches?page',
                templateUrl: 'scripts/plugins/Clinic/DiagnosticCenter/views/default/branches.html',
				controller: 'DiagnosticBranchesController',
                resolve: getToken
            }).state('diagnostic_branch_add', {
                url: '/diagnostic_center/branch/add',
                templateUrl: 'scripts/plugins/Clinic/DiagnosticCenter/views/default/branch_add.html',
                controller: 'DiagnosticBranchesAddController',
                resolve: getToken
            }).state('diagnostic_branch_edit', {
                url: '/diagnostic/branch/edit/:id',
                templateUrl: 'scripts/plugins/Clinic/DiagnosticCenter/views/default/branch_edit.html',
                controller: 'DiagnosticBranchesEditController',
                resolve: getToken
            }).state('diagnostic_branch_view', {
                url: '/diagnostic/branches/:id/:slug',
                templateUrl: 'scripts/plugins/Clinic/DiagnosticCenter/views/default/branch_profile.html',
                controller: 'DiagnosticBranchViewController',
                resolve: getToken
            }).state('diagnostic_lab_tests', {
                url: '/diagnostic/branch/lab_tests/:branch_id',
                templateUrl: 'scripts/plugins/Clinic/DiagnosticCenter/views/default/lab_tests.html',
                controller: 'DiagnosticCenterTestsController',
                resolve: getToken
            }).state('diagnostic_lab_test_add', {
                url: '/diagnostic/lab_tests/add/:branch_id',
                templateUrl: 'scripts/plugins/Clinic/DiagnosticCenter/views/default/lab_test_add.html',
                controller: 'DiagnosticCenterTestsAddController',
                resolve: getToken
            }).state('diagnostic_lab_test_edit', {
                url: '/diagnostic/lab_tests/edit/:id',
                templateUrl: 'scripts/plugins/Clinic/DiagnosticCenter/views/default/lab_test_edit.html',
                controller: 'DiagnosticCenterTestsEditController',
                resolve: getToken
            }).state('diagnostic_branch_users', {
                url: '/diagnostic/branch/users/:branch_id',
                templateUrl: 'scripts/plugins/Clinic/DiagnosticCenter/views/default/branch_users.html',
                controller: 'DiagnosticUsersController',
                resolve: getToken
            }).state('diagnostic_branch_user_add', {
                url: '/diagnostic/branch/users/add/:branch_id',
                templateUrl: 'scripts/plugins/Clinic/DiagnosticCenter/views/default/branch_users_add.html',
                controller: 'DiagnosticUsersAddController',
                resolve: getToken
            }).state('diagnostic_branch_user_edit', {
                url: '/diagnostic/branch/users/edit/:id',
                templateUrl: 'scripts/plugins/Clinic/DiagnosticCenter/views/default/branch_users_edit.html',
                controller: 'DiagnosticUsersEditController',
                resolve: getToken
            }).state('my_diagnostic_users', {
                url: '/diagnostic/users?page',
                templateUrl: 'scripts/plugins/Clinic/DiagnosticCenter/views/default/my_users.html',
                controller: 'DiagnosticUsersController',
                resolve: getToken
            }).state('diagnostic_dashboard', {
                url: '/labtests/{type}?page&appointment_date',
                templateUrl: 'scripts/plugins/Clinic/DiagnosticCenter/views/default/diagnostic_labtests.html',
                controller: 'DiagnosticLabTestsController',
                resolve: getToken
            }).state('MyDiagnosticLabTests', {
                url: '/labtests/all?page',
                templateUrl: 'scripts/plugins/Clinic/DiagnosticCenter/views/default/diagnostic_labtests.html',
                controller: 'DiagnosticLabTestsController',
                resolve: getToken
            }).state('choose_tests', {
                url: '/labtests/:diagnostic_center_user_id/:branch_id/choose-tests/:labtest_id',
                templateUrl: 'scripts/plugins/Clinic/DiagnosticCenter/views/default/choose_tests.html',
                controller: 'ChooseTestsController',
                resolve: getToken
            }).state('diagnostic_labtest_view', {
                url: '/labtest/report/:id',
                templateUrl: 'scripts/plugins/Clinic/DiagnosticCenter/views/default/diagnostic_labtest_view.html',
                controller: 'DiagnosticLabTestsController',
                resolve: getToken
            })
            .state('diagnostic_payment', {
                url: '/pay/diagnostic/payment/:id',
                templateUrl: 'scripts/plugins/Clinic/DiagnosticCenter/views/default/diagnostic_payment.html',
                controller: 'DiagnosticPaymentController',
                resolve: getToken
            });
    });