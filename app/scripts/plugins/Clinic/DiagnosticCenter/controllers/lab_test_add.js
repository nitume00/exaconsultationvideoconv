'use strict';
/**
 * @ngdoc function
 * @name abs.controller:BranchesController
 * @description
 * # BranchesController
 * Controller of the abs
 */
angular.module('abs')

.controller('DiagnosticCenterTestsAddController', function($state, $rootScope, $scope, $filter, $location, $timeout, flash,  LabTestsFactory, DiagnosticCenterTestsFactory, ConstUserType, md5, Upload){
    $scope.index = function () {
        $rootScope.pageTitle = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("Add Branch");
        $scope.branch_id = $state.params.branch_id;
        $scope.ConstUserType = ConstUserType;
    };
    $scope.index();
    /* [ GET - LabTests ] */
    var params = {};
    params.filter = '{"order":"name asc","limit":500,"skip":0}';
    LabTestsFactory.get(params).$promise.then(function (response) {
            if(angular.isDefined(response)){
                $scope.labtests = response.data;
            }                              
    }); 
    /* [ UPLOAD - DiagonosticTest image ] */
    $scope.upload = function (file) {
        Upload.upload({
            url: '/api/v1/attachments?class=LabTest',
            data: {
                file: file,
            }
        })
        .then(function (response) {
            if (response.data.error.code === 0) {
                $scope.data.diagonostic_test_image = response.data.attachment;
                $scope.error_message = '';
            } else {
                $scope.error_message = response.data.error.message;
            }
        });
     };
     /**
     * @ngdoc method
     * @name BranchesController.add branch
     * @methodOf module.BranchesController
     * @description
     * This method is used to add the branch
    */
    $scope.save_btn = false;
    $scope.addLabTest = function ($valid, data) {
            if ($valid && !$scope.error_message) {
                $scope.save_btn = true;
                $scope.data.diagnostic_center_user_id = $rootScope.auth.id;
                $scope.data.branch_id = $state.params.branch_id;
                console.log($scope.data);
                DiagnosticCenterTestsFactory.post($scope.data, function (response) {
                    if (parseInt(response.error.code) === 0) {
                            $timeout(function(){
                                 $state.go('diagnostic_lab_tests',{'branch_id':$state.params.branch_id},{reload:true});  
                            },500);  
                            flash.set($filter("translate")("Lab Test added successfully."), 'success', true);
                    } else {
                         $scope.save_btn = false;
                         flash.set($filter("translate")("Lab Test added failed."), 'error', false);
                    }
                }, function (response) {
                    flash.set($filter("translate")(response.data.error.message), 'error', false);
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