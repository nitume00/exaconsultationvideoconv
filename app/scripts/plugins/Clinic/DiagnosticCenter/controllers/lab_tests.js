'use strict';
/**
 * @ngdoc function
 * @name abs.controller:BranchesController
 * @description
 * # BranchesController
 * Controller of the abs
 */
angular.module('abs')

.controller('DiagnosticCenterTestsController', function($state, $rootScope, $scope, $filter, $location, $timeout, flash, DiagnosticCenterTestsFactory, SweetAlert, RemoveTest, DiagnosticCenterTestsEdit, BranchesEdit, md5){
    
    $scope.index = function () {
        $rootScope.pageTitle = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("My Lab Tests");
        $timeout(function () {
            $scope.text_box = true;
        }, 1000);
    };
     $scope.index();
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
     var params = {};       
   /**
     * @ngdoc method
     * @name BranchesController.branch
     * @methodOf module.BranchesController
     * @description
     * This method is used to get the clinic branches listing
    */
    $scope.mylabtests = function() {
        var params = {};
        $scope.branch_id = $state.params.branch_id;
        /* params.filter = '{"where":{"diagnostic_center_user_id":' + $rootScope.auth.id + ', "branch_id":'+ $scope.branch_id +'},"include":{"0":"lab_test.lab_test_image"}}'; */
        params.filter = '{"where":{"diagnostic_center_user_id":' + $rootScope.auth.id + ', "branch_id":'+ $scope.branch_id +'},"include":{"0":"lab_test", "1":"diagonostic_test_image"}}';
        $scope.loader = true;
        if($state.params.page === undefined) {
            params.page = 1;
        } else {
            params.page = $state.params.page;
        }  
        DiagnosticCenterTestsFactory.get(params, function(response) {
            if (angular.isDefined(response._metadata)) {
                $scope.currentPage = response._metadata.current_page;
                $scope.totalItems = response._metadata.total;
                $scope.itemsPerPage = response._metadata.per_page;
                $scope.noOfPages = response._metadata.last_page;
            }
            if (angular.isDefined(response.data)) {
                $scope.labtests = response.data;
                $scope.dataLength = (response.data.length > 0) ? true : false;
            }
            angular.forEach($scope.labtests, function (labtest) {
                if (angular.isDefined(labtest.diagonostic_test_image) && labtest.diagonostic_test_image !== null) {
                    var hash = md5.createHash(labtest.diagonostic_test_image.class + labtest.diagonostic_test_image.id + 'png' + 'big_thumb');
                    labtest.image = 'images/big_thumb/' + labtest.diagonostic_test_image.class + '/' + labtest.diagonostic_test_image.id + '.' + hash + '.png';
                } else {
                    labtest.image = 'images/diagnostic_image.jpg';
                }
            });
        });
        getBranchById($scope.branch_id);
    };
    $scope.mylabtests();
     /**
     * @ngdoc method
     * @name BranchesController.paginate
     * @methodOf module.BranchesController
     * @description
     * This method is used to get the branch listing
     */
     $scope.paginate = function() {
        $scope.currentPage = parseInt($scope.currentPage);
            $state.go('branch_doctors', {
                'page': $scope.currentPage,
            });
        $scope.mydoctors();
     };
     /**
     * @ngdoc method
     * @name BranchesController.delete
     * @methodOf module.BranchesController
     * @description
     * This method is used to remove the doctor from the branch listing
     */
     $scope.removeTest = function (labtest_id) {
            SweetAlert.swal({
                title: $filter("translate")("Are you sure you want to remove the lab test from branch list?"),
                text: "",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: $filter("translate")("OK"),
                cancelButtonText: $filter("translate")("Cancel!"),
                closeOnConfirm: true,
                animation: false,
            }, function (isConfirm) {
                if(isConfirm === true) {
                    RemoveTest.delete({
                        id: labtest_id
                    }, function (response) {
                        if (response.error.code === 0) {
                            $timeout(function(){
                                flash.set($filter("translate")("Your lab test has been deleted successfully."), 'success', false);
                            },500);      
                            $state.reload();
                        } else {
                            $timeout(function(){
                                flash.set($filter("translate")("Your lab test couldn't deleted. Please try again."), 'error', false);
                            },500);    
                            $state.reload();
                        }
                    });
                } 
            });
        }
        
        /**
     * @ngdoc method
     * @name BranchesController.statuschange
     * @methodOf module.BranchesController
     * @description
     * This method is used to status change for the branch 
     */
     $scope.changeStatus = function (lab_test_id, status) {
            var labTestData = {};
            labTestData.id = lab_test_id;
            labTestData.is_enable = status;
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
                    DiagnosticCenterTestsEdit.put(labTestData, function (response) {
                        if (response.error.code === 0) {
                            flash.set($filter("translate")("Your lab test status has been changed successfully."), 'success', false);
                            $state.reload();
                        } else {
                            flash.set($filter("translate")("Your lab test status couldn't updated. Please try again."), 'error', false);
                            $state.reload();
                        }
                    });
                }  
            });
        }
});   