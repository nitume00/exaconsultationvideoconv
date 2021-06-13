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
angular.module('abs.Clinic.Clinic', [
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
        $stateProvider.state('clinic_profile', {
                url: '/clinic/:id/:slug',
                templateUrl: 'scripts/plugins/Clinic/Clinic/views/default/clinic_profile.html',
                controller: 'ClinicController',
                resolve: getToken
            }).state('branches', {
                url: '/branches?page',
                templateUrl: 'scripts/plugins/Clinic/Clinic/views/default/branches.html',
				controller: 'BranchesController',
                resolve: getToken
            }).state('my_branches', {
                url: '/doctor/branches?page',
                templateUrl: 'scripts/plugins/Clinic/Clinic/views/default/my_branches.html',
				controller: 'BranchesController',
                resolve: getToken
            }).state('branch_add', {
                url: '/branch/add',
                templateUrl: 'scripts/plugins/Clinic/Clinic/views/default/branch_add.html',
                controller: 'BranchesAddController',
                resolve: getToken
            }).state('branch_edit', {
                url: '/branch/edit/:id',
                templateUrl: 'scripts/plugins/Clinic/Clinic/views/default/branch_edit.html',
                controller: 'BranchesEditController',
                resolve: getToken
            }).state('branch_view', {
                url: '/branches/:id/:slug',
                templateUrl: 'scripts/plugins/Clinic/Clinic/views/default/branch_profile.html',
                resolve: getToken
            }).state('branch_doctors', {
                url: '/branch/doctors/:branch_id?page',
                templateUrl: 'scripts/plugins/Clinic/Clinic/views/default/branch_doctors.html',
                controller: 'BranchesDoctorsController',
                resolve: getToken
            }).state('branch_doctor_add', {
                url: '/doctors/add/:branch_id',
                templateUrl: 'scripts/plugins/Clinic/Clinic/views/default/branch_doctors_add.html',
                controller: 'BranchesDoctorsAddController',
                resolve: getToken
            }).state('branch_doctor_edit', {
                url: '/doctors/edit/:id',
                templateUrl: 'scripts/plugins/Clinic/Clinic/views/default/branch_doctors_edit.html',
                controller: 'BranchesDoctorsEditController',
                resolve: getToken
            }).state('appointment_setting', {
                url: '/branch/doctor/:branch_id/:user_id/:apt_set_id/appoinmentsettings',
                templateUrl: 'scripts/plugins/Clinic/Clinic/views/default/appoinment_settings.html',
                controller: 'BranchesDoctorsController',
                resolve: getToken
            }).state('appointment_modification', {
                url: '/branch/doctor/:branch_id/:user_id/:apt_set_id/appoinmentmodification',
                templateUrl: 'scripts/plugins/Clinic/Clinic/views/default/appointment_modification.html',
                controller: 'BranchesDoctorsController',
                resolve: getToken
            }).state('appointment_modification_add', {
                url: '/branch/doctor/:branch_id/:user_id/:apt_set_id/appoinmentmodification/add',
                templateUrl: 'scripts/plugins/Clinic/Clinic/views/default/appointment_modification_add.html',
                controller: 'BranchesDoctorsController',
                resolve: getToken
            }).state('appointment_modification_edit', {
                url: '/branch/doctor/:id/:branch_id/:user_id/:apt_set_id/appoinmentmodification/update',
                templateUrl: 'scripts/plugins/Clinic/Clinic/views/default/appointment_modification_edit.html',
                controller: 'BranchesDoctorsController',
                resolve: getToken
            }).state('AppointmentView', {
                url: '/clinic/appointment/{id}',
                templateUrl: 'scripts/plugins/Clinic/Clinic/views/default/appointment_view.html',
                controller: 'ClinicAppointmentsController',
                resolve: getToken
            }).state('branch_users', {
                url: '/branch/users/:branch_id',
                templateUrl: 'scripts/plugins/Clinic/Clinic/views/default/branch_users.html',
                controller: 'BranchesUsersController',
                resolve: getToken
            }).state('branch_user_add', {
                url: '/users/add/:branch_id',
                templateUrl: 'scripts/plugins/Clinic/Clinic/views/default/branch_users_add.html',
                controller: 'BranchesUsersAddController',
                resolve: getToken
            }).state('branch_user_edit', {
                url: '/users/edit/:id',
                templateUrl: 'scripts/plugins/Clinic/Clinic/views/default/branch_users_edit.html',
                controller: 'BranchesUsersEditController',
                resolve: getToken
            }).state('clinic_dashboard', {
                url: '/clinic/dashboard',
                templateUrl: 'scripts/plugins/Clinic/Clinic/views/default/clinic_dashboard.html',
                controller: 'ClinicDashboardController',
                resolve: getToken
            }).state('my_doctors', {
                url: '/clinic/doctors?page',
                templateUrl: 'scripts/plugins/Clinic/Clinic/views/default/my_doctors.html',
                controller: 'BranchesDoctorsController',
                resolve: getToken
            }).state('my_users', {
                url: '/clinic/users?page',
                templateUrl: 'scripts/plugins/Clinic/Clinic/views/default/my_users.html',
                controller: 'BranchesUsersController',
                resolve: getToken
            }).state('account_info', {
                url: '/account_info',
                templateUrl: 'views/account_info.html',
                controller: 'PaymentAccountsController',
                resolve: getToken
            }).state('news_feeds', {
                url: '/clinic/news_feeds?page',
                templateUrl: 'scripts/plugins/Clinic/Clinic/views/default/news_feeds.html',
                controller: 'NewsFeedsController',
                resolve: getToken
            }).state('news_feeds_add', {
                url: '/news_feeds/add',
                templateUrl: 'scripts/plugins/Clinic/Clinic/views/default/news_feeds_add.html',
                controller: 'NewsFeedsController',
                resolve: getToken
            }).state('news_feeds_edit', {
                url: '/news_feeds/edit/:id',
                templateUrl: 'scripts/plugins/Clinic/Clinic/views/default/news_feeds_edit.html',
                controller: 'NewsFeedsController',
                resolve: getToken
            }).state('news_feeds_view', {
                url: '/news_feeds/:id/:slug',
                templateUrl: 'scripts/plugins/Clinic/Clinic/views/default/news_feeds_view.html',
                controller: 'NewsFeedsController',
                resolve: getToken
            });
    });
