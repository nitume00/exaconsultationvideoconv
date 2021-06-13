'use strict';
/**
 * @ngdoc function
 * @name eprescriptionApp.controller:BranchesController
 * @description
 * # BranchesController
 * Controller of the eprescriptionApp
 */
angular.module('abs')

.controller('PharmacyCtrl', function($state, $scope, $cookies){

    if ($cookies.get('auth') !== undefined && $cookies.get('auth') !== null) {
        auth = JSON.parse($cookies.get('auth'));
        $scope.user = auth;
    }else if(auth !== undefined){
        console.log(auth);
        $scope.user = auth;
    }

});    