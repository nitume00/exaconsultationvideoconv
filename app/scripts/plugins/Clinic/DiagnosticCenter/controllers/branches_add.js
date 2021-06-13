'use strict';
/**
 * @ngdoc function
 * @name abs.controller:BranchesController
 * @description
 * # BranchesController
 * Controller of the abs
 */
angular.module('abs')

.controller('DiagnosticBranchesAddController', function($state, $rootScope, $scope, $filter, $location, $timeout, flash, SweetAlert, BranchesFactory, LocationsFactory, SpecialtiesFactory, InsurancesFactory, CountriesFactory){
    $scope.index = function () {
        $rootScope.pageTitle = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("Add Branch");
        $scope.data = {};
        $timeout(function () {
            $scope.text_box = true;
        }, 1000);
    };
      var params = {};
    params.filter = '{"order":"name asc","limit":500,"skip":0}';
    CountriesFactory.get(params).$promise.then(function (response) {
            if(angular.isDefined(response)){
                $scope.countries = response.data;
            }                              
    });
     //Select List for notification types
    $scope.calendarSlots = [];
    $scope.calendarSlots.push(
        {'id': 5, 'name': ('5')},
        {'id': 10, 'name':('10')},
        {'id': 15, 'name':('15')},
        {'id': 20, 'name':('20')},
        {'id': 25, 'name':('25')},
        {'id': 30, 'name':('30')},
        {'id': 35, 'name':('35')},
        {'id': 40, 'name':('40')},
        {'id': 45, 'name':('45')},
        {'id': 50, 'name':('50')},
        {'id': 55, 'name':('55')},
        {'id': 60, 'name':('60')}
    );
    $scope.index();
    /* [ GEOLocations ] */
    $scope.$on('g-places-autocomplete:select', function (event) {
        angular.forEach(event.targetScope.model.address_components, function (value) {
            if (value.types[0] === 'locality' || value.types[0] === 'administrative_area_level_2') {
                $scope.data.city = {};
                $scope.data.city.name = value.short_name;
            }
            if (value.types[0] === 'administrative_area_level_1') {
                $scope.data.state = {};
                $scope.data.state.name = value.long_name;
            }
            if (value.types[0] === 'country') {
                $scope.data.country = {};
                $scope.data.country.iso2 = value.short_name;
                $scope.data.country.name = value.long_name;
                $scope.selectedCountry = value.short_name;
            }
            if (value.types[0] === 'postal_code') {
                $scope.data.postal_code = parseInt(value.long_name);
                $scope.disable_zip = true;
            } else {
                $scope.disable_zip = false;
            }
            $scope.data.latitude = event.targetScope.model.geometry.location.lat();
            $scope.data.longitude = event.targetScope.model.geometry.location.lng();
            $scope.data.address = event.targetScope.model.name + " " + event.targetScope.model.vicinity;
            $scope.data.full_address = event.targetScope.model.formatted_address;
        });
    });
    /* [ GET - Locations ] */
    function getLocations(){
        var params = {};
        params.filter = '{"order":"location asc","limit":500,"skip":0}';
        LocationsFactory.get(params).$promise.then(function (response) {
            if(angular.isDefined(response)){
                $scope.locations = response.data;
            }                              
        }); 
    }
    
     /*multiple image file upload */
     $scope.$on('MulitpleUploader', function(event, data) {
        $scope.imagedata = data;
        $scope.image = [];
    });
    
     /**
     * @ngdoc method
     * @name BranchesController.add branch
     * @methodOf module.BranchesController
     * @description
     * This method is used to add the branch
    */
    $scope.save_btn = false;
    $scope.postBranch = function ($valid, data) {
            if ($valid && !$scope.error_message) {
                $scope.save_btn = true;
                $scope.data.clinic_user_id = $rootScope.auth.id;
                $scope.data.is_active = 1;
                $scope.data.city = $scope.data.city;
                $scope.data.state = $scope.data.state;
                $scope.data.country = $scope.data.country;
                $scope.data.postal_code = $scope.data.postal_code;
                $scope.data.open_time = moment($scope.data.open_time).format('HH:mm:ss');
                $scope.data.lunch_at = moment($scope.data.lunch_at).format('HH:mm:ss');
                $scope.data.resume_at = moment($scope.data.resume_at).format('HH:mm:ss');
                $scope.data.close_time = moment($scope.data.close_time).format('HH:mm:ss');
                if (angular.isDefined($scope.imagedata) && Object.keys($scope.imagedata)
                .length > 0) {
                    $scope.data.branch_images = [];
                    angular.forEach($scope.imagedata, function(img) {
                        angular.forEach(img, function(branchImage) {
                            if (branchImage.attachment !== undefined) {
                                $scope.data.branch_images.push({"image": branchImage.attachment });
                            }
                        });
                    });
                }
                BranchesFactory.post($scope.data, function (response) {
                    var flashMessage;
                    if (parseInt(response.error.code) === 0) {
                            flashMessage = $filter("translate")("Branch added successfully.");
                            $state.go('diagnostic_branches');
                            flash.set(flashMessage, 'success', false);
                    } else {
                        $scope.save_btn = false;
                         flashMessage = $filter("translate")("Branch added failed.");
                         flash.set(flashMessage, 'error', false);
                    }
                }, function (error) {
                    console.log('postBranch Error', error);
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