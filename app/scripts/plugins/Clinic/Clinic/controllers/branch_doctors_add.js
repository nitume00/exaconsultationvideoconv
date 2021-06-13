'use strict';
/**
 * @ngdoc function
 * @name abs.controller:BranchesController
 * @description
 * # BranchesController
 * Controller of the abs
 */
angular.module('abs')

.controller('BranchesDoctorsAddController', function($state, $rootScope, $scope, $filter, $location, $timeout, flash,  CountriesFactory, DoctorsFactory, SpecialtiesFactory, LanguagesFactory, SearchDoctors, ConstUserType, md5, InsurancesFactory){
    $scope.index = function () {
        $rootScope.pageTitle = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("Add Branch");
        $scope.data = {};
        $scope.branch_id = $state.params.branch_id;
        $scope.ConstUserType = ConstUserType;
        $scope.branchinfo = $rootScope.branchinfo;
        $scope.findDoctor = false;
        $scope.data = {};
        $scope.data.country_id = 84;
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
     /**
     * @ngdoc method
     * @name BranchesController.add branch
     * @methodOf module.BranchesController
     * @description
     * This method is used to add the branch
    */
   
    $scope.addDoctor = function ($valid, data) {
            if ($valid && !$scope.error_message) {
                $scope.save_btn = true;
                /* [ DATA - specialties_users - TAGINPUT] */
                if (angular.isDefined($scope.data.specialty_select) && Object.keys($scope.data.specialty_select)
                    .length > 0) {
                    $scope.data.specialties_users = [];
                    angular.forEach($scope.data.specialty_select, function (value) {
                        $scope.data.specialties_users.push({
                            specialty_id: value.id
                        });
                    });
                    delete $scope.data.specialty_select;
                }
                /* [ DATA - insurances_users - TAGINPUT] */
                if (angular.isDefined($scope.data.insurance_select) && Object.keys($scope.data.insurance_select)
                    .length > 0) {
                    $scope.data.insurances_users = [];
                    angular.forEach($scope.data.insurance_select, function (value) {
                        $scope.data.insurances_users.push({
                            insurance_id: value.id
                        });
                    });
                    delete $scope.data.insurance_select;
                }
                /* [ DATA - languages_users - TAGINPUT] */
                if (angular.isDefined($scope.data.language_select) && Object.keys($scope.data.language_select)
                    .length > 0) {
                    $scope.data.languages_users = [];
                    angular.forEach($scope.data.language_select, function (value) {
                        $scope.data.languages_users.push({
                            language_id: value.id
                        });
                    });
                    delete $scope.data.language_select;
                }
                 /* [ ADD MORE - user_educations ] */
                if (angular.isDefined($scope.user_educations) && Object.keys($scope.user_educations)
                    .length > 0) {
                     $scope.data.user_educations = [];
                     angular.forEach($scope.user_educations, function (value) {
                        $scope.data.user_educations.push({
                            education: value.education,
                            location: value.location,
                            organization: value.organization,
                            certification_date: $filter('date')(new Date(value.certification_date),'yyyy-MM-dd')
                        });
                    });
                }       
                $scope.data.clinic_user_id = ($rootScope.auth.role_id === $scope.ConstUserType.SubAccount) ? $rootScope.branchinfo.clinic_user_id : $rootScope.auth.id;    
                $scope.data.branch_id = $state.params.branch_id;
                console.log($scope.data, 'data');
                DoctorsFactory.post($scope.data, function (response) {
                    if (parseInt(response.error.code) === 0) {
                            $timeout(function(){
                                 if( $rootScope.auth.role_id === ConstUserType.SubAccount){
                                     $state.go('ManageDoctors',{'branch_id':$state.params.branch_id, 'clinic_user_id':response.data.clinic_user_id,'slug':'manage'},{reload:true});
                                 } else {
                                     $state.go('branch_doctors',{'branch_id':$state.params.branch_id},{reload:true});
                                 }   
                            },500);  
                            flash.set($filter("translate")("Doctor added successfully."), 'success', true);
                    } else {
                         $scope.save_btn = false;
                         flash.set($filter("translate")("Doctor added failed."), 'error', false);
                    }
                }, function (response) {
                    console.log(response, 'errorres');
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
        $scope.showDoctors = false;
        $scope.addDoctors = false;
        $scope.data = {};
        $scope.searchDoctor = function ($valid, data) {
			if (data !== '' && data !== undefined) {
				$scope.data.mobile = data.mobile_number;
                params.filter = '{"where":{"mobile": "'+$scope.data.mobile+'"},"include":{"0":"attachment","1":"user_profile.gender","2":"branches_doctor"}}';
                SearchDoctors.get(params, function(response) {
                    $scope.doctors = response.data;
                    console.log($scope.doctors);
                    $scope.dataLength = (response.data.length > 0) ? true : false;
                    $scope.addDoctors = (response.data.length > 0) ? false : true;
                    $scope.showDoctors = true;
                    angular.forEach($scope.doctors, function (doctor) {
                        $scope.show_add = true;
                        if (angular.isDefined(doctor.attachment) && doctor.attachment !== null) {
                            var hash = md5.createHash(doctor.attachment.class + doctor.attachment.id + 'png' + 'big_thumb');
                            doctor.image = 'images/big_thumb/' + doctor.attachment.class + '/' + doctor.attachment.id + '.' + hash + '.png';
                        } else {
                            doctor.image = 'images/default.png';
                        }
                        angular.forEach(doctor.branches_doctor, function (value) {
                            if (angular.isDefined(value) && value !== null) {
                                if (parseInt(doctor.id) === parseInt(value.user_id) && parseInt($scope.branch_id) === parseInt(value.branch_id)) {
                                    $scope.show_add = false;
                                }
                            } else {
                                $scope.show_add = true;
                            }   
                        });
                    });
                });
			}
		};

        /* AddPage */
		$scope.addBranchDoctor = function (user_id,branch_id) {
            $scope.data = {};
            $scope.data.clinic_user_id = $rootScope.auth.id;
            $scope.data.branch_id = branch_id;
            $scope.data.user_id = user_id; 
			DoctorsFactory.post($scope.data, function (response) {
                    if (parseInt(response.error.code) === 0) {
                            $timeout(function(){
                                 if( $rootScope.auth.role_id === $scope.ConstUserType.SubAccount){
                                     $location.path('doctors/'+$state.params.branch_id+'/'+response.data.clinic_user_id+'/manage');
                                 } else {
                                     $state.go('branch_doctors',{'branch_id':$state.params.branch_id},{reload:true});
                                 }     
                            },500);  
                            flash.set($filter("translate")("Doctor added successfully."), 'success', true);
                    } else {
                         $scope.save_btn = false;
                         flash.set($filter("translate")("Doctor added failed."), 'error', false);
                    }
                }, function (response) {
                    flash.set($filter("translate")(response.data.error.message), 'error', false);
                });
		};
        $scope.findFrm = function () {
            $scope.findDoctor = true;
        }    
        
});   