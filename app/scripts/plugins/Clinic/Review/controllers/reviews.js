'use strict';
/**
 * @ngdoc function
 * @name abs.controller:BranchesController
 * @description
 * # BranchesController
 * Controller of the abs
 */
angular.module('abs')

.controller('ReviewsController', function ($state, $scope, $rootScope, $filter, $location, flash, ReviewPost, ReviewsFactory) {
    $scope.branch_review ={};
    $scope.init = function () {
        $rootScope.pageTitle = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("Review & Rating");
        if($state.params.type === 'branch') {
            getDoctorReview($state.params.provider_user_id);
            getBranchReview($state.params.clinic_user_id);
        } else if($state.params.type === 'doctor') {
            getDoctorReview($state.params.provider_user_id);
        }    
        $scope.review_type = $state.params.type;
    };
    /* [ GET - Appointment Count] */ 
    function getDoctorReview(to_user_id){
        var params ={};
        params.filter = '{"where":{"user_id":'+ $rootScope.auth.id +',"to_user_id":'+ to_user_id +', "foreign_type":"Appointment"}}';
        ReviewsFactory.get(params).$promise.then(function (response) {
            $scope.review = response.data[0];
            $scope.isAlreadyReviewed= (response.data.length > 0) ? true : false;
        }); 
    }
    /* [ GET - Appointment Count] */ 
    function getBranchReview(clinic_user_id){
        var params ={};
        params.filter = '{"where":{"user_id":' + $rootScope.auth.id + ', "clinic_user_id":'+ clinic_user_id +', "foreign_type":"Branch"}}';
        ReviewsFactory.get(params).$promise.then(function (response) {
            $scope.branch_review = response.data[0];
            if(response.data.length > 0) {
                $scope.branch_bedside_rate = $scope.branch_review.bedside_rate;
                $scope.branch_waittime_rate = $scope.branch_review.waittime_rate;
                $scope.branch_message = $scope.branch_review.message; 
            } 
            $scope.isBranchReviewed= (response.data.length > 0) ? true : false;   
        }); 
    }
    $scope.init();

    $scope.postDoctorReviewRating = function ($valid, form){
        if ($valid) {
            $scope.disableButton = true;
            var reviewData = {};
            reviewData.foreign_id =  $state.params.apt_id;
            reviewData.user_id = $rootScope.auth.id;
            reviewData.to_user_id = $state.params.provider_user_id;
            reviewData.branch_id = $state.params.branch_id;
            reviewData.clinic_user_id = $state.params.clinic_user_id;
            reviewData.foreign_type ="Appointment";
            reviewData.bedside_rate = form.bedside_rate.$modelValue;
            reviewData.waittime_rate = form.waittime_rate.$modelValue;
            reviewData.message = form.message.$modelValue;
            ReviewPost.post(reviewData).$promise.then(function (response){
                if (response.error.code === 0) {
                        flash.set($filter("translate")("Doctor rate & review added successfully."), 'success', true);
                        $scope.disableButton = false;
                        $state.go('MyAppointments');
                    } else {
                        flash.set($filter("translate")(response.error.message), 'error', false);
                        $scope.disableButton = false;
                }
            });
        }   
    }
    $scope.postBranchReviewRating = function ($valid, form, review_type){
        if ($valid) {
            $scope.disableButton = true;
            var reviewData = {};
            reviewData.foreign_id =  $state.params.branch_id;
            reviewData.user_id = $rootScope.auth.id;
            reviewData.branch_id = $state.params.branch_id;
            reviewData.clinic_user_id =  $state.params.clinic_user_id;
            reviewData.to_user_id = (review_type === 'diagnostic') ? $state.params.clinic_user_id: $state.params.provider_user_id;
            reviewData.foreign_type ="Branch";
            reviewData.bedside_rate = form.branch_bedside_rate.$modelValue;
            reviewData.waittime_rate = form.branch_waittime_rate.$modelValue;
            reviewData.message = form.branch_message.$modelValue;
            ReviewPost.post(reviewData).$promise.then(function (response){
                if (response.error.code === 0) {
                        flash.set($filter("translate")("Branch rate & review added successfully."), 'success', true);
                        $scope.disableButton = false;
                        $state.go('MyAppointments');
                    } else {
                        flash.set($filter("translate")(response.error.message), 'error', false);
                        $scope.disableButton = false;
                }
            });
        }   
    }
});