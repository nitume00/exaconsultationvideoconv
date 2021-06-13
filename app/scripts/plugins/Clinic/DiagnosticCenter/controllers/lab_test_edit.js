'use strict';
/**
 * @ngdoc function
 * @name abs.controller:BranchesController
 * @description
 * # BranchesController
 * Controller of the abs
 */
angular.module('abs')

.controller('DiagnosticCenterTestsEditController', function($state, $rootScope, $scope, $filter, $location, $timeout, flash,  LabTestsFactory, DiagnosticCenterTestsEdit, Upload, md5){
    $scope.index = function () {
        $rootScope.pageTitle = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("Edit Doctor");
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
    /**
     * @ngdoc method
     * @name BranchesController.edit branch
     * @methodOf module.BranchesController
     * @description
     * This method is used to edit the branch
    */
    params.id = $state.params.id;
    params.filter = '{"include":{"0":"lab_test", "1":"diagonostic_test_image"}}';
    $scope.DiagnosticCenterEdit = function() {
        DiagnosticCenterTestsEdit.get(params, function(response) {
            $scope.data = response.data;
            $scope.data.lab_test_id = response.data.lab_test.id;
            if (angular.isDefined(response.data.diagonostic_test_image)) {
                if (response.data.diagonostic_test_image !== null) {
                    $scope.labtest_image = 'images/big_thumb/DiagonosticTest/' + response.data.diagonostic_test_image.id + '.' + md5.createHash('DiagonosticTest' + response.data.diagonostic_test_image.id + 'png' + 'big_thumb') + '.png';
                }
            }
        });
    };
    $scope.DiagnosticCenterEdit();
    
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
     * @name JobsEditController.submit
     * @methodOf module.JobsEditController
     * @description
     * This method is used to post the jobs
     */
    $scope.save_btn = false;
    $scope.updateLabTest = function ($valid, data) {
        if ($valid && !$scope.error_message) {
            $scope.save_btn = true;
            var labtestData = {};
            labtestData.id = data.id;
            labtestData.lab_test_id = data.lab_test_id;
            labtestData.price = data.price;
            labtestData.diagonostic_test_image = $scope.data.diagonostic_test_image;
            DiagnosticCenterTestsEdit.put(labtestData, function(response) {
                $scope.save_btn = false;
                if (parseInt(response.error.code) === 0) {
                            $timeout(function(){
                                 $state.go('diagnostic_lab_tests',{'branch_id':data.branch_id},{reload:true});  
                            },500);  
                            flash.set($filter("translate")("Lab Test updated successfully."), 'success', true);
                    } else {
                         $scope.save_btn = false;
                         flash.set($filter("translate")("Lab Test updated failed."), 'error', false);
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