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

/**
 * @ngdoc function
 * @name BookorRent.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the BookorRent
 */
angular.module('abs')
    .controller('MainController', function($rootScope, $scope, $window, $cookies, $state, $location, $filter,$uibModal, $uibModalStack, SweetAlert, ConstUserType, $timeout, ConstAppointmentStatus) {
        $rootScope.isAuth = false;
        $rootScope.ConstUserType = ConstUserType;
        $rootScope.cdate = new Date();
        $rootScope.ConstAppointmentStatus = ConstAppointmentStatus;
    });