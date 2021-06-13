'use strict';
/**
 * @ngdoc function
 * @name abs.controller:BranchesController
 * @description
 * # BranchesController
 * Controller of the abs
 */
angular.module('abs')

.controller('DiagnosticUsersAddController', function($state, $rootScope, $scope, $filter, $location, $timeout, flash,  CountriesFactory, UsersFactory, PermissionsFactory){
    $scope.index = function () {
        $rootScope.pageTitle = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("Add User");
        $scope.data = {};
        $scope.branch_id = $state.params.branch_id;
    };
    $scope.index();
    
    /* [ GET - Countries ] */
    var params = {};
    params.filter = '{"order":"name asc","limit":500,"skip":0}';
    CountriesFactory.get(params).$promise.then(function (response) {
            if(angular.isDefined(response)){
                $scope.countries = response.data;
            }                              
    }); 
    PermissionsFactory.get().$promise.then(function (response) {
            if(angular.isDefined(response)){
                $scope.permissions = response.data;
            }                              
    }); 
    $scope.permission_select = [];
    $scope.check = function(value, checked) {
            var idx = $scope.permission_select.indexOf(value);
            if (idx >= 0 && !checked) {
                $scope.permission_select.splice(idx, 1);
            }
            if (idx < 0 && checked) {
                $scope.permission_select.push(value);
            }
    };
     /**
     * @ngdoc method
     * @name BranchesController.add branch
     * @methodOf module.BranchesController
     * @description
     * This method is used to add the branch
    */
    $scope.save_btn = false;
    $scope.addUser = function ($valid, data) {
            if ($valid && !$scope.error_message) {
                $scope.save_btn = true;
                $scope.data.clinic_user_id = $rootScope.auth.id;
                $scope.data.branch_id = $state.params.branch_id;
                $scope.data.permissions = [];
                if (angular.isDefined($scope.permission_select) && Object.keys($scope.permission_select)
                    .length > 0) {                       
                    angular.forEach($scope.permission_select, function(value) {
                        $scope.data.permissions.push({
                            'name': value
                        });
                    });
                } else {
                    $scope.save_btn = true;
                    flash.set($filter("translate")("Please select atleast one permission for Sub Accounts"), 'error', false);
                }
                delete $scope.data.user_permissions;
                UsersFactory.post($scope.data, function (response) {
                    if (parseInt(response.error.code) === 0) {
                            $timeout(function(){
                                 $state.go('diagnostic_branch_users',{'branch_id':$state.params.branch_id},{reload:true});  
                            },500);  
                            flash.set($filter("translate")("User added successfully."), 'success', true);
                    } else {
                         $scope.save_btn = false;
                         flash.set($filter("translate")("User added failed."), 'error', false);
                    }
                }, function (response) {
                    $scope.save_btn = true;
                      var keysvalue = Object.keys(response.data.error.raw_message);
                        if(keysvalue.length > 0)
                        {
                            flash.set($filter("translate")(response.data.error.raw_message.mobile), 'error', false);
                        }else{
                            flash.set($filter("translate")(response.data.error.raw_message), 'error', false);
                        }
                });
            } else {
                $timeout(function () {
                    $('.error')
                        .each(function () {
                            if (!$(this)
                                .hasClass('ng-hide')) {
                                $scope.scrollvalidate($(this)
                                    .offset().top-140);
                                return false;
                            }
                        });
                }, 100);
            }
        };
        $scope.scrollvalidate = function (topvalue) {
            $('html, body')
                .animate({
                    'scrollTop': topvalue
                });
        }
    
});   