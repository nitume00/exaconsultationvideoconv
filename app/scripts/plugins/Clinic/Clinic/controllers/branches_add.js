'use strict';
/**
 * @ngdoc function
 * @name abs.controller:BranchesController
 * @description
 * # BranchesController
 * Controller of the abs
 */
angular.module('abs')

.controller('BranchesAddController', function($state, $rootScope, $scope, $filter, $location, $timeout, flash, SweetAlert, BranchesFactory, LocationsFactory, SpecialtiesFactory, InsurancesFactory, CountriesFactory){
    $scope.index = function () {
        $rootScope.pageTitle = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("Add Branch");
        $scope.data = {};
        getLocations();
        $timeout(function () {
            $scope.text_box = true;
        }, 1000);
    };
    $scope.index();
    /* [ GET - Specialties ] */
    var params = {};
    params.filter = '{"order":"name asc","limit":500,"skip":0}';
    CountriesFactory.get(params).$promise.then(function (response) {
            if(angular.isDefined(response)){
                $scope.countries = response.data;
            }                              
    }); 
    var params = {};
    params.filter = '{"order":"name asc","limit":500,"skip":0}';
    SpecialtiesFactory.get(params).$promise.then(function (response) {
                if (parseInt(response.error.code) === 0) {
                    $scope.specialties = response.data;
                    $scope.branchSpecialty = [];
                    angular.forEach($scope.specialties, function (value) {
                        $scope.branchSpecialty.push({
                            id: value.id,
                            text: value.name
                        });
                        if ($scope.branchSpecialtiesList !== undefined) {
                            if ($scope.branchSpecialtiesList.indexOf(value.id) != -1) {
                                $scope.data.specialty_select.push({
                                    id: value.id,
                                    text: value.name
                                });
                            }
                        }
                    });
                } else {
                    console.log('Specialties Error');
                }
            }, function (error) {
                console.log('BranchSpecialty Error', error);
    });
    /* [ GET - Insurances ] */
    params.filter = '{"order":"name asc","limit":500,"skip":0}';
    InsurancesFactory.get(params).$promise.then(function (response) {
                if (parseInt(response.error.code) === 0) {
                    $scope.insurances = response.data;
                    $scope.branchInsurance = [];
                    angular.forEach($scope.insurances, function (value) {
                        $scope.branchInsurance.push({
                            id: value.id,
                            text: value.name
                        });
                        if ($scope.branchInsurancesList !== undefined) {
                            if ($scope.branchInsurancesList.indexOf(value.id) != -1) {
                                $scope.data.insurance_select.push({
                                    id: value.id,
                                    text: value.name
                                });
                            }
                        }
                    });
                } else {
                    console.log('Insurances Error');
                }
            }, function (error) {
                console.log('BranchInsurance Error', error);
    });
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
    /* [ LOAD - Specialties - TAGINPUT] */
    $scope.loadSpecialties = function (qstr) {
            qstr = qstr.toLowerCase();
            var items = [];
            angular.forEach($scope.branchSpecialty, function (value) {
                name = value.text.toLowerCase();
                if (name.indexOf(qstr) >= 0) {
                    items.push({
                        id: value.id,
                        text: value.text
                    });
                }
            });
            return items;
    };
    
    /* [ LOAD - Specialties - TAGINPUT] */
    $scope.loadInsurances = function (qstr) {
            qstr = qstr.toLowerCase();
            var items = [];
            angular.forEach($scope.branchInsurance, function (value) {
                name = value.text.toLowerCase();
                if (name.indexOf(qstr) >= 0) {
                    items.push({
                        id: value.id,
                        text: value.text
                    });
                }
            });
            return items;
    };

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
    $scope.postBranch = function ($valid, formName) {
        if ($valid && !$scope.error_message) {
            $scope.save_btn = true;
            if (angular.isDefined($scope.data.specialty_select) && Object.keys($scope.data.specialty_select)
                .length > 0) {
                $scope.data.branches_specialties = [];
                angular.forEach($scope.data.specialty_select, function (value) {
                    $scope.data.branches_specialties.push({
                        specialty_id: value.id
                    });
                });
            }
            if (angular.isDefined($scope.data.insurance_select) && Object.keys($scope.data.insurance_select)
                .length > 0) {
                $scope.data.branches_insurances = [];
                angular.forEach($scope.data.insurance_select, function (value) {
                    $scope.data.branches_insurances.push({
                        insurance_id: value.id
                    });
                });
            }
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
            $scope.data.clinic_user_id = $rootScope.auth.id;
            $scope.data.is_active = 1;
            $scope.data.city = $scope.data.city;
            $scope.data.state = $scope.data.state;
            $scope.data.country = $scope.data.country;
            $scope.data.postal_code = $scope.data.postal_code;

            BranchesFactory.post($scope.data, function (response) {
                var flashMessage;
                if (parseInt(response.error.code) === 0) {
                        flashMessage = $filter("translate")("Branch added successfully.");
                        $state.go('branches');
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