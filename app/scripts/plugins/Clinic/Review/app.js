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
angular.module('abs.Clinic.Review', [
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
    $stateProvider.state('WriteReview', {
            url: '/reviews/{apt_id}/{provider_user_id}/{branch_id}/{clinic_user_id}/add/{type}',
            templateUrl: 'scripts/plugins/Clinic/Review/views/default/review_booking.html',
            controller: 'ReviewsController',
            resolve: getToken
    }).state('DoctorReview', {
        url: '/reviews/{apt_id}/{provider_user_id}/add/{type}',
        templateUrl: 'scripts/plugins/Clinic/Review/views/default/review_booking.html',
        controller: 'ReviewsController',
        resolve: getToken
    }).state('Reviews', {
        url: '/reviews',
        templateUrl: 'scripts/plugins/Clinic/Clinic/views/default/branches.html',
        controller: 'BranchesController',
        resolve: getToken
    }); 
 });