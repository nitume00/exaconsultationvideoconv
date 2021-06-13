'use strict';
/**
 * @ngdoc function
 * @name abs.controller:UserEducationsController
 * @description
 * # UserEducationsController
 * Controller of the abs
 */
angular.module('abs')

    .controller('UserEducationsController', function ($scope, $rootScope, $filter, $state, $timeout, flash, SweetAlert, $anchorScroll, UserEducations, UserEducationAdd,UserEducationEditFactory) {
        $scope.noRecords = false;
        $scope.typeid = '1';
        $scope.user_educations = [];
        $scope.dateBlockeBefore = $filter('date')(new Date(), "yyyy-MM-dd");
        $scope.index = function () {
            $rootScope.pageTitle = $rootScope.settings.SITE_NAME + " | " + $filter("translate")("My Educations");
        };
        
        /* [ Flash Message ] */
        function flashMessage(message,classname){
            flash.set($filter("translate")(message), classname, true);
        }
        
        /* [ GET Doctor Educations ] */
        function getUserEducations(params) {
			UserEducations.get(params).$promise.then(function (response) {
					if (angular.isDefined(response.data)) {
						$scope.typeid = '1';
						$scope.noRecords = (response.data.length > 0) ? true : false;
						$scope.my_educations = response.data;
						$scope._metadata = response._metadata;
						$scope.currentPage = response._metadata.current_page;
						$scope.maxSize = 5;
					}
			});
		} 
        if ($state.current.name === 'user_educations') {
			$scope.currentPage = ($scope.currentPage !== undefined) ? parseInt($scope.currentPage) : 1;
			var params = {};
			params.filter = '{"where":{"user_id":' + $rootScope.auth.id + '}}';
			getUserEducations(params);
		}	
        $scope.paginate = function (currentPage) {
			var param = {
                    'page': currentPage
                };
			getUserEducations(param);
            $('html, body').stop(true, true).animate({
                scrollTop: 1200
            }, 600);
        };

        /* [ ADD and Edit Doctor Educations ] */
        $scope.userEducation = function (isvalid,data) {
			if (isvalid) {
                var userProfileData = {};
                userProfileData.user_id = $rootScope.auth.id;
                userProfileData.education = data.education;
                userProfileData.location = data.location;
                userProfileData.organization = data.organization;
                userProfileData.certification_date = $filter('date')(new Date(data.certification_date),'yyyy-MM-dd');
                userProfileData.is_active =1;
                if ($scope.typeid === '1') {
                    UserEducations.post(userProfileData).$promise.then(function (response){
                        if (angular.isDefined(response)) {
                            /* [ Success Response ] */
                            if (parseInt(response.error.code) === 0) {
                                $timeout(function(){
                                    $state.go('user_educations', {}, { reload:true });  
                                },500);                        
                                flashMessage("Educations added successfully",'success');
                            } else {
                                flashMessage("Please try again",'error');
                            }                                
                        }
                    });
                } else {
                    var params = {};
					params.id = $scope.data.educationId;
					UserEducationEditFactory.put($scope.data).$promise.then(function (response){
						if (angular.isDefined(response)) {
							if (parseInt(response.error.code) === 0) {
								$timeout(function(){
									$state.go('user_educations', {}, { reload:true });  
								},500);                        
								flashMessage("Educations updated successfully",'success');   
							} else {
								flashMessage("Please try again",'error');
							}                               
						}
					});
                }    
			}
        };

        /* [ GETBYID - Doctor Educations ] */
        $scope.editUsereducation = function(value){
			var params = {};
			params.id = value;
			UserEducationEditFactory.get(params).$promise.then(function (response){
				if (angular.isDefined(response)) {
					$scope.data = response.data;
					$scope.typeid = '2';
                    $scope.data.educationId = value;
					$anchorScroll('friendtop');
				}
			});
		};

        /* [ Remove - Doctor Educations ] */
        $scope.removeUsereducation = function (id) {
             SweetAlert.swal({
                title: $filter("translate")("Are you sure want to delete?"),
                text: "",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55", confirmButtonText: $filter("translate")("Yes"),
                cancelButtonText: $filter("translate")("No"),
                closeOnConfirm: true,
                closeOnCancel: true
            },
            function (isConfirm) {
                if (isConfirm) {
                    var params = {};
			        params.id = id;
                    UserEducationEditFactory.delete(params).$promise.then(function (response) {
                        flash.set($filter("translate")("Education deleted successfully"), 'success', true);
                        $state.reload();
                    }, function (error) {
                        flash.set($filter("translate")("Education could not be deleted"), 'error', false);
                    });
                }
            });
        };
        $scope.index();
    });

