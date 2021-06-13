'use strict';
/**
 * @ngdoc function
 * @name abs.controller:BranchesController
 * @description
 * # BranchesController
 * Controller of the abs
 */
angular.module('abs')

.controller('BranchesEditController', function($state, $rootScope, $scope, $filter, $location, $timeout, flash, SweetAlert, CountriesFactory, BranchesEdit, LocationsFactory, SpecialtiesFactory, InsurancesFactory, md5, AttachementDelete){
       var params = {};
    $scope.index = function () {
        $rootScope.pageTitle = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("Edit Branch");
        $timeout(function () {
            $scope.text_box = true;
        }, 1000);
    /* [ GET - Specialties ] */
    params.filter = '{"order":"name asc","limit":500,"skip":0}';
    CountriesFactory.get(params).$promise.then(function (response) {
            if(angular.isDefined(response)){
                $scope.countries = response.data;
            }                              
    }); 
    params = {};
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
    };
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
    $scope.getLocations = function() {
        var params = {};
        params.filter = '{"order":"location asc","limit":500,"skip":0}';
        LocationsFactory.get(params).$promise.then(function (response) {
            if(angular.isDefined(response)){
                $scope.locations = response.data;
            }                              
        }); 
    };
    $scope.getLocations();
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
     * @name BranchesController.edit branch
     * @methodOf module.BranchesController
     * @description
     * This method is used to edit the branch
    */
    var selectedSpecialty = [];
    var selectedInsurance = [];
    $scope.branchEdit = function() {
         params.id = $state.params.id;
         params.filter = '{"include":{"0":"branches_specialty.specialty","1":"branches_insurance.insurance","2":"city","3":"state","4":"country","5":"attachment"}}';
        BranchesEdit.get(params, function(response) {
            if(angular.isDefined(response.data)) {
                $scope.data = response.data;
                if (response.data.country_id) {
                    $scope.selectedCountry = response.data.country.iso2;
                }
                if(response.data.attachment.length !== 0)  {
                    angular.forEach(response.data.attachment, function(branchimage){
                        branchimage.image = 'images/normal_thumb/Branch/' + branchimage.id + '.' + md5.createHash('Branch' + branchimage.id + 'png' + 'normal_thumb') + '.png';
                    });
                }
            }
            /* [ Selected - Specialties - TAGINPUT] */
            angular.forEach(response.data.branches_specialty, function (value) {
               selectedSpecialty.push(value.specialty_id);
            });
            $scope.data.specialty_select = [];
            angular.forEach(response.data.branches_specialty, function(value) {
                $scope.data.specialty_select.push({
                    'id' :value.specialty.id,
                    'text': value.specialty.name
                });
            });
            /* [ Selected - Insurances - TAGINPUT] */
            angular.forEach(response.data.branches_insurance, function (value) {
               selectedInsurance.push(value.insurance_id);
            });
            $scope.data.insurance_select = [];
            angular.forEach(response.data.branches_insurance, function(value) {
                $scope.data.insurance_select.push({
                     'id' :value.insurance.id,
                    'text': value.insurance.name
                });
            });
        });
    };
    $scope.branchEdit();

    /**
     * @ngdoc method
     * @name JobsEditController.submit
     * @methodOf module.JobsEditController
     * @description
     * This method is used to post the jobs
     */
    $scope.save_btn = false;
    $scope.updateBranch = function ($valid, data) {
        if ($valid && !$scope.error_message) {
            $scope.save_btn = true;
            if (angular.isDefined(data.specialty_select) && Object.keys(data.specialty_select)
                    .length > 0) {
                data.branch_specialties = [];
                angular.forEach(data.specialty_select, function (value) {
                    data.branch_specialties.push({
                        specialty_id: value.id
                    });
                });
            }
            if (angular.isDefined(data.insurance_select) && Object.keys(data.insurance_select)
                    .length > 0) {
                data.branch_insurances = [];
                angular.forEach(data.insurance_select, function (value) {
                    data.branch_insurances.push({
                        insurance_id: value.id
                    });
                });
            }
            if (angular.isDefined($scope.imagedata) && Object.keys($scope.imagedata)
                    .length > 0) {
                    data.branch_images = [];
                    angular.forEach($scope.imagedata, function(img) {
                        angular.forEach(img, function(branchImage) {
                            if (branchImage.attachment !== undefined) {
                                data.branch_images.push({"image": branchImage.attachment });
                            }
                        });
                    });
           }
            
            var branchData = {};
            branchData.id = data.id;
            branchData.name = data.name;
            branchData.description = data.description;
            branchData.phone_number = data.phone_number;
            branchData.consultation_fee = data.consultation_fee;
            branchData.location_id = data.location_id;
            branchData.branch_specialties = data.branch_specialties;
            branchData.branch_insurances = data.branch_insurances;
            branchData.branch_images = data.branch_images;   
            branchData.address = data.address;
            branchData.full_address = data.full_address;
            branchData.city = data.city;
            branchData.state = data.state;
            branchData.country = data.country;
            branchData.postal_code = data.postal_code;

            BranchesEdit.put(branchData, function(response) {
                $scope.save_btn = false;
                $scope.response = response;
                if (response.error.code === 0) {
                    $state.go('branches');
                    flash.set($filter("translate")("Branch updated successfully."), 'success', true);
                } else {
                    flash.set($filter("translate")(response.error.message), 'error', false);
                    $scope.save_btn = false;
                }
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
    $scope.RemoveBranchImages = function (attachmentId) {
            SweetAlert.swal({
                title: $filter("translate")("Are you sure you want to remove this image?"),
                text: "",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: $filter("translate")("OK"),
                cancelButtonText: $filter("translate")("Cancel!"),
                closeOnConfirm: true,
                animation: false,
            }, function (isConfirm) {
                 if(isConfirm === true) {  
                    AttachementDelete.delete({
                        attachmentId: attachmentId
                    }, function (response) {
                        if (response.error.code === 0) {
                            flash.set($filter("translate")("Your branch image has been deleted successfully."), 'success', false);
                             $scope.branchEdit();
                             $scope.index();
                        } else {
                            flash.set($filter("translate")("Your branch image couldn't deleted. Please try again."), 'error', false);
                            $scope.branchEdit();
                            $scope.index();
                        }
                    });
                 }    
            });
        }
});   