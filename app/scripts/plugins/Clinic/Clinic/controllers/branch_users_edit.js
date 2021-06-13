'use strict';
/**
 * @ngdoc function
 * @name abs.controller:BranchesController
 * @description
 * # BranchesController
 * Controller of the abs
 */
angular.module('abs')

.controller('BranchesUsersEditController', function($state, $rootScope, $scope, $filter, $location, $timeout, flash,  CountriesFactory, UsersFactory,UsersEdit, PermissionsFactory){
    $scope.index = function () {
        $rootScope.pageTitle = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("Add User");
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
    $scope.userData = {};
    params = {};
    params.id = $state.params.id;
    params.filter = '{"include":{"0":"branch","1":"user.user_profile","2":"user.user_profile.city","3":"user.user_profile.country"}}';
    $scope.userEdit = function() {
        UsersEdit.get(params, function(response) {
            $scope.userData = response.data;
            var selected_permissions =[];
                if(response.data.permissions !== null)
                {
                    var sel_permissions = response.data.permissions.split(', ');
                    for(var i=0; i<sel_permissions.length; i++) { 
                        selected_permissions[i] = sel_permissions[i]; 
                    }
                }
                $scope.userData = {
                    user_permissions:  selected_permissions
                };
            $scope.userData.id = response.data.id;
            $scope.userData.branch_id = response.data.branch_id;
            $scope.userData.name = response.data.user.username;
            $scope.userData.mobile = response.data.user.mobile;
            $scope.userData.email = response.data.user.email; 
            $scope.userData.mobile_code = response.data.user.user_profile.country.phone_code;
            $scope.userData.country_id = parseInt(response.data.user.country_id);   
        });
    };
    $scope.userEdit();

    /**
     * @ngdoc method
     * @name JobsEditController.submit
     * @methodOf module.JobsEditController
     * @description
     * This method is used to post the jobs
     */
    $scope.save_btn = false;
    var userData = {};
    $scope.updateUser = function ($valid, data) {
        if ($valid && !$scope.error_message && data.user_permissions.length !== 0) {
            $scope.save_btn = true;
            $scope.permissions = [];
                if (angular.isDefined(data.user_permissions) && Object.keys(data.user_permissions)
                    .length > 0) {                       
                    angular.forEach(data.user_permissions, function(value) {
                        $scope.permissions.push({
                            'name': value
                        });
                    });
                } else {
                    $scope.save_btn = true;
                    flash.set($filter("translate")("Please select atleast one permission for Sub Accounts"), 'error', false);
            }
            userData.id = data.id;
            userData.name = data.name;
            userData.email = data.email;
            userData.country_id = data.country_id;
            userData.permissions = $scope.permissions;
            UsersEdit.put(userData, function(response) {
                $scope.save_btn = false;
                $scope.response = response;
                if (parseInt(response.error.code) === 0) {
                            $timeout(function(){
                                 $state.go('branch_users',{'branch_id':data.branch_id},{reload:true});  
                            },500);  
                            flash.set($filter("translate")("User updated successfully."), 'success', true);
                    } else {
                         $scope.save_btn = false;
                         flash.set($filter("translate")("User updated failed."), 'error', false);
                    }
            }, function (response) {
                    flash.set($filter("translate")(response.data.error.message), 'error', false);
           });
        } else {
            $timeout(function() {
                $('.error')
                    .each(function() {
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
    $scope.scrollvalidate = function(topvalue) {
        $('html, body')
            .animate({
                'scrollTop': topvalue
            });
    };
});   