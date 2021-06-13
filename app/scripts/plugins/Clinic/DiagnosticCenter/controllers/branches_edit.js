'use strict';
/**
 * @ngdoc function
 * @name abs.controller:BranchesController
 * @description
 * # BranchesController
 * Controller of the abs
 */
angular.module('abs')

.controller('DiagnosticBranchesEditController', function($state, $rootScope, $scope, $filter, $location, $timeout, flash, SweetAlert, BranchesEdit, LocationsFactory, CountriesFactory, md5, AttachementDelete){
    var params = {};
    $scope.index = function () {
        $rootScope.pageTitle = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("Edit Branch");
        $timeout(function () {
            $scope.text_box = true;
        }, 1000);
    };
    /* [ GET - Specialties ] */
    params.filter = '{"order":"name asc","limit":500,"skip":0}';
    CountriesFactory.get(params).$promise.then(function (response) {
            if(angular.isDefined(response)){
                $scope.countries = response.data;
            }                              
    }); 
    //Select List for notification types
    $scope.calendarSlots = [];
    $scope.calendarSlots.push(
        {'id': 5, 'name': ('5 mins')},
        {'id': 10, 'name':('10 mins')},
        {'id': 15, 'name':('15 mins')},
        {'id': 20, 'name':('20 mins')},
        {'id': 25, 'name':('25 mins')},
        {'id': 30, 'name':('30 mins')},
        {'id': 35, 'name':('35 mins')},
        {'id': 40, 'name':('40 mins')},
        {'id': 45, 'name':('45 mins')},
        {'id': 50, 'name':('50 mins')},
        {'id': 55, 'name':('55 mins')},
        {'id': 60, 'name':('60 mins')}
    );
    $scope.index();
    /* [ GET - Specialties ] */
    var flashMessage ='';
    var params = {};
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
     
    /**
     * @ngdoc method
     * @name BranchesController.edit branch
     * @methodOf module.BranchesController
     * @description
     * This method is used to edit the branch
    */
    $scope.branchEdit = function() {
        params.id = $state.params.id;
        params.filter = '{"include":{"1":"city","2":"state","3":"country", "4":"attachment"}}';
        BranchesEdit.get(params, function(response) {
            $scope.data = response.data;
            if (response.data.country_id) {
                $scope.selectedCountry = response.data.country.iso2;
            }
            if(response.data.attachment.length !== 0)  {
                angular.forEach(response.data.attachment, function(branchimage){
                    branchimage.image = 'images/normal_thumb/Branch/' + branchimage.id + '.' + md5.createHash('Branch' + branchimage.id + 'png' + 'normal_thumb') + '.png';
                });
            }
            $scope.data.interval = parseInt($scope.data.interval);
            $scope.data.open_time = moment($scope.data.open_time, 'HH:mm:ss');
            $scope.data.open_time = moment($scope.data.open_time, 'HH:mm:ss');
            $scope.data.close_time = moment($scope.data.close_time, 'HH:mm:ss');
            $scope.data.lunch_at = moment($scope.data.lunch_at, 'HH:mm:ss');
            $scope.data.resume_at = moment($scope.data.resume_at, 'HH:mm:ss');
        });
    };
    $scope.branchEdit();

    /*multiple image file upload */
    $scope.$on('MulitpleUploader', function(event, data) {
        $scope.imagedata = data;
        $scope.image = [];
    });
    /**
     * @ngdoc method
     * @name JobsEditController.submit
     * @methodOf module.JobsEditController
     * @description
     * This method is used to post the jobs
     */
    $scope.save_btn = false;
    $scope.updateBranch = function ($valid, data) {
        if ($valid) {
            $scope.save_btn = true;
            if (angular.isDefined($scope.imagedata) && Object.keys($scope.imagedata).length > 0) {
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
            branchData.consultation_fee = data.consultation_fee;
            branchData.phone_number = data.phone_number;
            branchData.location_id = data.location_id;
            branchData.address = data.address;
            branchData.full_address = data.full_address;
            branchData.city = data.city;
            branchData.state = data.state;
            branchData.country = data.country;
            branchData.postal_code = data.postal_code;
            branchData.branch_images = data.branch_images;
            branchData.open_time = moment(data.open_time).format('HH:mm:ss');
            branchData.lunch_at = moment(data.lunch_at).format('HH:mm:ss');
            branchData.resume_at = moment(data.resume_at).format('HH:mm:ss');
            branchData.close_time = moment(data.close_time).format('HH:mm:ss');
            BranchesEdit.put(branchData, function(response) {
                $scope.save_btn = false;
                $scope.response = response;
                if ($scope.response.error.code === 0) {
                    $timeout(function(){
                                 $state.go('diagnostic_branches',{reload:true});  
                            },500);  
                    flash.set($filter("translate")("Branch updated successfully."), 'success', true);
                } else {
                    flash.set($filter("translate")("Branch updated failed."), 'error', false);
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