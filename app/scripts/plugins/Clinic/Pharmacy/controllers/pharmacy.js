'use strict';
/**
 * @ngdoc function
 * @name abs.controller:BranchesController
 * @description
 * # BranchesController
 * Controller of the abs
 */
angular.module('abs')

.controller('PharmacyController', function($state, $rootScope, $scope, $filter, $location, $timeout, flash, SweetAlert, BranchesFactory, BranchesEdit, MyDoctorsFactory){
     $scope.maxSize = 5;
     $scope.lastPage = 1;
     $scope.itemsPerPage = 20; 
       
     $rootScope.pageTitle = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("Branches");

     $scope.currentPage = (angular.isDefined($state.params.page)) ? parseInt($state.params.page) : 1;
     $scope.skipvalue = $scope.itemsPerPage !== undefined ? ($scope.currentPage - 1) * $scope.itemsPerPage : 0;
     $scope.itemsPerPage = $scope.itemsPerPage !== undefined ? $scope.itemsPerPage : 0;
     $scope.myBranches = function() {
        if ($state.current.name === 'my_branches') {
            var params = {};
            params.filter = '{"where":{"user_id":' + $rootScope.auth.id + '},"limit":'+$scope.itemsPerPage+',"skip":'+$scope.skipvalue+',"include":{"0":"branch.city","1":"branch.country","2":"clinic_user.user_profile"}}';
            $scope.loader = true;
            if($state.params.page === undefined) {
                params.page = 1;
            } else {
                params.page = $state.params.page;
            }  
            MyDoctorsFactory.get(params, function(response) {
                if (angular.isDefined(response._metadata)) {
                        $scope.currentPage = response._metadata.current_page;
                        $scope.lastPage = response._metadata.last_page;
                        $scope.itemsPerPage = 20;
                        $scope.totalRecords = response._metadata.total;
                        $scope.Perpage = response._metadata.per_page;
                    }
                if (angular.isDefined(response.data)) {
                    $scope.branches = response.data;
                    $scope.dataLength = (response.data.length > 0) ? true : false;
                }
                    $scope.loader = false;
            });
        }  
    }
     if ($state.current.name === 'my_branches') {
        $scope.myBranches();
      }
   /**
     * @ngdoc method
     * @name BranchesController.branch
     * @methodOf module.BranchesController
     * @description
     * This method is used to get the clinic branches listing
    */
       
     $scope.loader = true;
    $scope.mybranch = function() {
       
        var params = {};
        params.filter = '{"where":{"clinic_user_id":' + $rootScope.auth.id + '},"limit":'+$scope.itemsPerPage+',"skip":'+$scope.skipvalue+',"include":{"0":"city","1":"country"},"order":"id desc"}';
        if($state.params.page === undefined) {
            params.page = 1;
        } else {
            params.page = $state.params.page;
        }  
        BranchesFactory.get(params, function(response) {
          if (angular.isDefined(response._metadata)) {
                    $scope.currentPage = response._metadata.current_page;
                    $scope.lastPage = response._metadata.last_page;
                    $scope.itemsPerPage = 20;
                    $scope.totalRecords = response._metadata.total;
                    $scope.Perpage = response._metadata.per_page;
                }
            if (angular.isDefined(response.data)) {
                $scope.branches = response.data;
                $scope.dataLength = (response.data.length > 0) ? true : false;
            }
             $scope.loader = false;
        });
    };
     if ($state.current.name !== 'my_branches') {
          $scope.mybranch();
      }
  
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
                  if ($state.current.name !== 'my_branches') {
                        $scope.mybranch();
                    }
                  if ($state.current.name === 'my_branches') {
                        $scope.myBranches();
                    }

            }, 1000);
        };
     /**
     * @ngdoc method
     * @name BranchesController.statuschange
     * @methodOf module.BranchesController
     * @description
     * This method is used to status change for the branch 
     */
     $scope.changeStatus = function (branch_id, status) {
            var branchData = {};
            branchData.id = branch_id;
            branchData.is_active = status;
            SweetAlert.swal({
                title: $filter("translate")("Are you sure you want to change the status?"),
                text: "",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: $filter("translate")("OK"),
                cancelButtonText: $filter("translate")("Cancel!"),
                closeOnConfirm: true,
                animation: false,
            }, function (isConfirm) {
                if(isConfirm === true) {
                    BranchesEdit.put(branchData, function (response) {
                        if (response.error.code === 0) {
                            flash.set($filter("translate")("Your doctor has been deleted successfully."), 'success', false);
                            $state.reload();
                        } else {
                            flash.set($filter("translate")("Your doctor couldn't deleted. Please try again."), 'error', false);
                            $state.reload();
                        }
                    });
                }  
            });
    }
});