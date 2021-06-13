'use strict';
/**
 * @ngdoc function
 * @name abs.controller:BranchesController
 * @description
 * # BranchesController
 * Controller of the abs
 */
angular.module('abs')

.controller('BranchesDoctorsEditController', function($state, $rootScope, $scope, $filter, $location, $timeout, flash,  CountriesFactory, DoctorsEdit, SpecialtiesFactory, LanguagesFactory, InsurancesFactory){
    $scope.index = function () {
        $rootScope.pageTitle = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("Edit Doctor");
    };
    $scope.index();
    
    /* [ GET - Countries ] */
    var params = {};
    params.filter = '{"order":"name asc","limit":500,"skip":0}';
    CountriesFactory.get(params).$promise.then(function (response) {
            if(angular.isDefined(response)){
                $scope.countries = response.data;
            }                              
    }); 

    /* [ GET - Specialties ] */
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
    /* [ GET - Languages ] */
    params.filter = '{"order":"name asc","limit":500,"skip":0}';
    LanguagesFactory.get(params).$promise.then(function (response) {
                if (parseInt(response.error.code) === 0) {
                    $scope.languages = response.data;
                    $scope.branchLanguage = [];
                    angular.forEach($scope.languages, function (value) {
                        $scope.branchLanguage.push({
                            id: value.id,
                            text: value.name
                        });
                        if ($scope.branchLanguagesList !== undefined) {
                            if ($scope.branchLanguagesList.indexOf(value.id) != -1) {
                                $scope.data.language_select.push({
                                    id: value.id,
                                    text: value.name
                                });
                            }
                        }
                    });
                } else {
                    console.log('Languages Error');
                }
            }, function (error) {
                console.log('BranchLanguage Error', error);
    });
    /* [ LOAD - Specialties - TAGINPUT] */
    $scope.loadLanguages = function (qstr) {
            qstr = qstr.toLowerCase();
            var items = [];
            angular.forEach($scope.branchLanguage, function (value) {
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

    /**
     * @ngdoc method
     * @name BranchesController.edit branch
     * @methodOf module.BranchesController
     * @description
     * This method is used to edit the branch
    */
    var selectedSpecialty = [];
    var selectedLanguage = [];
    params.id = $state.params.id;
    params.filter = '{"include":{"0":"branch","1":"user","2":"user.user_profile","3":"user.attachment","4":"user.user_profile.city","5":"user.user_profile.country","6":"specialties_user.specialty","7":"languages_user.language", "8":"insurances_user.insurance"}}';
    $scope.doctorEdit = function() {
        DoctorsEdit.get(params, function(response) {
            $scope.data = response.data;
            $scope.data.name = response.data.user.username;
            $scope.data.mobile = response.data.user.mobile;
            $scope.data.email = response.data.user.email; 
            $scope.data.country_id = response.data.user.user_profile.country.id;
            /* [ Selected - Specialties - TAGINPUT] */
            angular.forEach(response.data.specialties_user, function (value) {
               selectedSpecialty.push(value.specialty_id);
            }); 
            $scope.data.specialty_select = [];
            angular.forEach(response.data.specialties_user, function(value) {
                $scope.data.specialty_select.push({
                    'id' :value.specialty.id,
                    'text': value.specialty.name
                });
            });
            /* [ Selected - Insurances - TAGINPUT] */
            angular.forEach(response.data.languages_user, function (value) {
               selectedLanguage.push(value.language_id);
            });
            $scope.data.language_select = [];
            angular.forEach(response.data.languages_user, function(value) {
                $scope.data.language_select.push({
                     'id' :value.language.id,
                    'text': value.language.name
                });
            });
        });
    };
    $scope.doctorEdit();
    
    /**
     * @ngdoc method
     * @name JobsEditController.submit
     * @methodOf module.JobsEditController
     * @description
     * This method is used to post the jobs
     */
    $scope.save_btn = false;
    $scope.updateDoctor = function ($valid, data) {
        if ($valid && !$scope.error_message) {
            $scope.save_btn = true;
            if (angular.isDefined(data.specialty_select) && Object.keys(data.specialty_select)
                    .length > 0) {
                data.specialties_users = [];
                angular.forEach(data.specialty_select, function (value) {
                    data.specialties_users.push({
                        specialty_id: value.id
                    });
                });
            }
            if (angular.isDefined(data.language_select) && Object.keys(data.language_select)
                    .length > 0) {
                data.languages_users = [];
                angular.forEach(data.language_select, function (value) {
                    data.languages_users.push({
                        language_id: value.id
                    });
                });
            }
            var doctorData = {};
            doctorData.id = data.id;
            doctorData.name = data.name;
            doctorData.email = data.email;
            doctorData.country_id = data.country_id;
            doctorData.room_number = data.room_number;
            doctorData.specialties_users = data.specialties_users;
            doctorData.languages_users = data.languages_users;
            DoctorsEdit.put(doctorData, function(response) {
                $scope.save_btn = false;
                $scope.response = response;
                if (parseInt(response.error.code) === 0) {
                            $timeout(function(){
                                 $state.go('branch_doctors',{'branch_id':data.branch_id},{reload:true});  
                            },500);  
                            flash.set($filter("translate")("Doctor updated successfully."), 'success', true);
                    } else {
                         $scope.save_btn = false;
                         flash.set($filter("translate")("Doctor updated failed."), 'error', false);
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