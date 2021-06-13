'use strict';
/**
 * @ngdoc function
 * @name abs.controller:BranchesController
 * @description
 * # BranchesController
 * Controller of the abs
 */
angular.module('abs')

.controller('BranchesUsersController', function($state, $rootScope, $scope, $filter, $location, $timeout, flash,  UsersFactory, SweetAlert, RemoveUser, BranchesEdit){
    
    $rootScope.pageTitle = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("Manage Users");
     $scope.branch_id = $state.params.branch_id;
      $scope.maxSize = 5;
      $scope.lastPage = 1;
      $scope.itemsPerPage = 20;    
   /**
     * @ngdoc method
     * @name BranchesController.branch
     * @methodOf module.BranchesController
     * @description
     * This method is used to get the clinic branches listing
    */
    $scope.loader = true;
    $scope.myusers = function() {
        var params = {};
        $scope.branch_id = $state.params.branch_id;
          $scope.currentPage = (angular.isDefined($state.params.page)) ? parseInt($state.params.page) : 1;
          $scope.skipvalue = $scope.itemsPerPage !== undefined ? ($scope.currentPage - 1) * $scope.itemsPerPage : 0;
          $scope.itemsPerPage = $scope.itemsPerPage !== undefined ? $scope.itemsPerPage : 0;
        if($state.current.name === 'my_users') {
            params.filter = '{"where":{"clinic_user_id":' + $rootScope.auth.id + '},"include":{"0":"branch","1":"user.user_profile","2":"user.user_profile.city"},"limit":'+$scope.itemsPerPage+',"skip":'+$scope.skipvalue+'}';
        } else {
            params.filter = '{"where":{"clinic_user_id":' + $rootScope.auth.id + ', "branch_id":'+ $scope.branch_id +'},"include":{"0":"branch","1":"user","2":"user.user_profile","3":"user.attachment","4":"user.user_profile.city","5":"user.user_profile.country"}, "limit":'+$scope.itemsPerPage+',"skip":'+$scope.skipvalue+'}';
        }    
        if($state.params.page === undefined) {
            params.page = 1;
        } else {
            params.page = $state.params.page;
        }  
        UsersFactory.get(params, function(response) {
            if (response._metadata) {
                    $scope.currentPage = response._metadata.current_page;
                    $scope.lastPage = response._metadata.last_page;
                    $scope.itemsPerPage = 20;
                    $scope.totalRecords = response._metadata.total;
                    $scope.Perpage = response._metadata.per_page;
                }
            if (angular.isDefined(response.data)) {
                $scope.users = response.data;
                $scope.dataLength = (response.data.length > 0) ? true : false;
            }
            $scope.loader = false;
        });
    };
    $scope.myusers();
     /**
     * @ngdoc method
     * @name BranchesController.paginate
     * @methodOf module.BranchesController
     * @description
     * This method is used to get the branch listing
     */
       $scope.paginate_search = function (element, currentPage) {
            $scope.currentPage = currentPage;
            $location.search('page', currentPage);
            $('html, body').stop().animate({ scrollTop: 0 }, 1000, 'swing', false);
            $timeout(function () {
                 $scope.myusers();
            }, 1000);
        };

     /**
     * @ngdoc method
     * @name BranchesController.delete
     * @methodOf module.BranchesController
     * @description
     * This method is used to remove the doctor from the branch listing
     */
     $scope.removeUser = function (branch_user_id) {
            SweetAlert.swal({
                title: $filter("translate")("Are you sure you want to remove the user from branch list?"),
                text: "",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: $filter("translate")("OK"),
                cancelButtonText: $filter("translate")("Cancel!"),
                closeOnConfirm: true,
                animation: false,
            }, function (isConfirm) {
                 if(isConfirm === true) {  
                    RemoveUser.delete({
                        id: branch_user_id
                    }, function (response) {
                        if (response.error.code === 0) {
                            flash.set($filter("translate")("Your user has been deleted successfully."), 'success', false);
                            $state.reload();
                        } else {
                            flash.set($filter("translate")("Your user couldn't deleted. Please try again."), 'error', false);
                            $state.reload();
                        }
                    });
                 }    
            });
        }
        /* [ GET - branch by Id ] */  
        function getBranchById(id){
            var params = {};
            params.id = id;
            params.filter = '{"fields":{"id":true,"name":true}}';
            BranchesEdit.get(params).$promise.then(function (response) {
                if(angular.isDefined(response)){
                    if (response.Failed) {
                        flashMessage(response.Failed,'error');
                    } else {
                        $scope.branch = response.data; 
                    }                                                            
                }                              
            });
        }
        getBranchById($scope.branch_id);
});   