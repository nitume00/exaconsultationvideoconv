'use strict';
/**
 * @ngdoc function
 * @name abs.controller:BranchesController
 * @description
 * # BranchesController
 * Controller of the abs
 */
angular.module('abs')

.controller('BranchesUsersAddController', function($state, $rootScope, $scope, $filter, $location, $timeout, flash,  CountriesFactory, UsersFactory, PermissionsFactory, SearchUsers, ConstUserType){
    $scope.index = function () {
        $rootScope.pageTitle = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("Add User");
        $scope.data = {};
        $scope.ConstUserType = ConstUserType;
    };
    $scope.index();
    $scope.branch_id = $state.params.branch_id;    
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
                                 $state.go('branch_users',{'branch_id':$state.params.branch_id},{reload:true});  
                            },500);  
                            flash.set($filter("translate")("User added successfully."), 'success', true);
                    } else {
                         $scope.save_btn = false;
                         flash.set($filter("translate")("User added failed."), 'error', false);
                    }
                }, function (response) {
                    $scope.save_btn = true;
                      if(response.data.error.raw_message === "" || response.data.error.raw_message === null || response.data.error.raw_message === undefined)
                    {flash.set($filter("translate")(response.data.error.message), 'error', false);  
                    }else{
                        var keys = Object.keys(response.data.error.raw_message);
                        if(keys.length > 0)
                        {
                            flash.set($filter("translate")(response.data.error.raw_message.mobile), 'error', false);
                        }else{
                            flash.set($filter("translate")(response.data.error.raw_message), 'error', false);
                        }
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

        $scope.showUsers = false;
        $scope.addUsers = false;
        $scope.data = {};
        $scope.searchUser = function ($valid, data) {
			if (data !== '' && data !== undefined) {
				$scope.data.mobile = data.mobile_number;
                params.filter = '{"where":{"mobile": "'+$scope.data.mobile+'"},"include":{"0":"attachment","1":"user_profile","2":"branches_user"}}';
                SearchUsers.get(params, function(response) {
                        $scope.users = response.data;
                        $scope.dataLength = (response.data.length > 0) ? true : false;
                        $scope.addUsers = (response.data.length > 0) ? false : true;
                        if(response.data.length !== 0)
                        {
                            $scope.BranchUserAlreadyAdded = (response.data[0].branches_user.length > 0)? true : false;
                            $scope.BranchUser =  (parseInt(response.data[0].branches_user[0].branch_id) === parseInt($state.params.branch_id))?true : false; 
                        }
                        $scope.showUsers = true;
                        angular.forEach($scope.users, function (user) {
                                $scope.show_add = false;
                                if (angular.isDefined(user.attachment) && user.attachment !== null) {
                                    var hash = md5.createHash(user.attachment.class + user.attachment.id + 'png' + 'medium_thumb');
                                    user.image = 'images/medium_thumb/' + user.attachment.class + '/' + user.attachment.id + '.' + hash + '.png';
                                } else {
                                    user.image = 'images/default.png';
                                }
                                if (parseInt(user.role_id) === ConstUserType.SubAccount && 
                                    (parseInt(user.parent_id) === 0 || parseInt(user.parent_id) === $rootScope.auth.id)) {
                                        $scope.show_add = true;
								}
                        });
                });
			}
		};

        /* AddPage */
		$scope.addBranchUser = function (user_id,branch_id) {
            $scope.data = {};
            $scope.data.clinic_user_id = $rootScope.auth.id;
            $scope.data.branch_id = branch_id;
            $scope.data.user_id = user_id;
			UsersFactory.post($scope.data, function (response) {
                    if (parseInt(response.error.code) === 0) {
                            $timeout(function(){
                                 $state.go('branch_users',{'branch_id':$state.params.branch_id},{reload:true});  
                            },500);  
                            flash.set($filter("translate")("User added successfully."), 'success', true);
                    } else {
                         $scope.save_btn = false;
                         flash.set($filter("translate")("User added failed."), 'error', false);
                    }
                }, function (response) {
                    if(response.data.error.raw_message === "" || response.data.error.raw_message === null || response.data.error.raw_message === undefined)
                    {flash.set($filter("translate")(response.data.error.message), 'error', false);  
                    }else{
                        var keysvalue = Object.keys(response.data.error.raw_message);
                        if(keysvalue.length > 0)
                        {
                            flash.set($filter("translate")(response.data.error.raw_message.mobile), 'error', false);
                        }else{
                            flash.set($filter("translate")(response.data.error.raw_message), 'error', false);
                        }
                    }
                });
		};
    
});   