'use strict';
/**
 * @ngdoc function
 * @name abs.controller:BranchesController
 * @description
 * # BranchesController
 * Controller of the abs
 */
angular.module('abs')
    /**
     * @ngdoc controller
     * @name user.controller:MedicalHistoryController
     * @description
     *
     * This is dashboard controller. It contains all the details about the user. It fetches the data of the user by using AuthFactory.
     **/
    .controller('MedicalHistoryController', function ($scope, $filter, $rootScope, $state, flash, SweetAlert, $timeout,  $location, DateFormat, MedicalHistory, MedicalHistoryAction, AttachmentDelete, SpecialtiesFactory, MedicalHistoryView, AppointmentFactory, UserSpecialty, ClinicAppointmentFactory, FormFieldSubmissionForm, AppointmentView) {
        $rootScope.url_split = $location.path().split("/")[1];
        $rootScope.state_params = $state.params;
        $scope.maxSize = 5;
        $scope.lastPage = 1;
        $scope.itemsPerPage = 20;
        $scope.DateFormat = DateFormat;
        $scope.data = {};
        $scope.currentPage = (angular.isDefined($state.params.page)) ? parseInt($state.params.page) : 1;
        $scope.skipvalue = $scope.itemsPerPage !== undefined ? ($scope.currentPage - 1) * $scope.itemsPerPage : 0;
        $scope.itemsPerPage = $scope.itemsPerPage !== undefined ? $scope.itemsPerPage : 0;
        var params = {};
        $scope.index = function () {
            $rootScope.pageTitle = $rootScope.settings.SITE_NAME + " | " + $filter("translate")("Manage Consultations");
            $timeout(function () {
                $scope.text_box = true;
            }, 1000);
        };
        function getMedicalHistory(params) {
            MedicalHistory.get(params).$promise.then(function(response){
                if (angular.isDefined(response._metadata)) {
                    $scope.currentPage = response._metadata.current_page;
                    $scope.lastPage = response._metadata.last_page;
                    $scope.itemsPerPage = 20;
                    $scope.totalRecords = response._metadata.total;
                    $scope.Perpage = response._metadata.per_page;
                }
                 $scope.dataLength = (response.data.length > 0) ? true : false;
                 $scope.medicalHistories = response.data;
                 $scope.loader = false;
                 $scope._metadata = response._metadata;
            });
	    }
        function getSpecialties(user_id) {
            params = {};
            if(user_id !== '0') {
                $scope.specialties = [];
                params.filter = '{"where":{"user_id":' + user_id + '},"include":{"0":"specialty"}}';
                UserSpecialty.get(params).$promise.then(function (response){    
                    console.log(response.data);
                    if (angular.isDefined(response.data) && Object.keys(response.data)
                    .length > 0) {
                        angular.forEach(response.data, function (value) {
                            $scope.specialties.push({
                                "id": value.specialty.id,
                                "name": value.specialty.name
                            });
                        });
                    } 
                });
            } else {
                params.filter = '{"order":"name asc","limit":500,"skip":0}';
                SpecialtiesFactory.get(params).$promise.then(function (response){
                    $scope.specialties = response.data;
                });
            }    
        } 
        function getDoctors() {
            $scope.doctors = [];
            var newCount = 1;
            var api_filter = {};
            var Where = [];
            Where.push({
                "where": {},
                "include": {}
            });
            api_filter.user_id =  $rootScope.auth.id;
            Where[0].include[0] = 'provider_user.user_profile';
            Where[0].where = api_filter;
            Where[0].order = 'id asc';
            params.filter = JSON.stringify(Where[0]);
            var doctor_id = '';
            AppointmentFactory.get(params).$promise.then(function (response){
                $scope.appointments = response.data;
                if (angular.isDefined($scope.appointments) && Object.keys($scope.appointments)
                    .length > 0) {
                    angular.forEach($scope.appointments, function (value) {
                        //if(doctor_id !== value.provider_user.id){
                          //  doctor_id = value.provider_user.id;
                            $scope.doctors.push({
                                "id": newCount,
                                "user_id": value.provider_user.id,
                                "apt_id": value.id,
                                "name": "Dr. "+value.provider_user.user_profile.display_name+ " - " + value.appointment_token
                            });
                            newCount += 1;
                        //}
                    });
                } 
                $scope.doctors.push({
                    'id': -1,
                    "user_id": 0,
                    "name": "No reference"
                });
            });
        } 
        function getSpecialtyFormData(user_id, specialty_id) {
            var api_filter = {};
            var Where = [];
            Where.push({
                "where": {},
                "include": {}
            });
            api_filter.user_id =  user_id;
            api_filter.specialty_id =  specialty_id;
            Where[0].include[0] = 'specialty';
            Where[0].where = api_filter;
            params.filter = JSON.stringify(Where[0]);
            FormFieldGroupForm.get({user_id: user_id , specialty_id: specialty_id }).$promise.then(function (response) {
                if (Object.keys(response.data).length > 0) {
                    $rootScope.userFormDatas = response.data[0].form_field;
                } else {
                    $rootScope.userFormDatas = ""; 
                }        
            });
        }
        
        function getPatientFormData(appointment_id) {
            var api_filter = {};
            var Where = [];
            Where.push({
                "where": {},
                "include": {}
            });
            api_filter.user_id =  appointment_id;
            Where[0].include[0] = 'form_field';
            Where[0].where = api_filter;
            params.filter = JSON.stringify(Where[0]);
            FormFieldSubmissionForm.get(params).$promise.then(function (response) {
                $scope.form_submissions = response.data;   
            });
        }    
        
        function getAppointments() {
            $scope.patients = [];
            var patientCount = 1;
            $scope.loader = true;
            var Where = [];
            var api_filter = {};
            Where.push({
                "where": {},
                "include": {}
            });
            api_filter.provider_user_id =   $rootScope.auth.id;
            Where[0].include[0] = 'user.user_profile';
            Where[0].include[1] = 'provider_user.user_profile';
            Where[0].include[2] = 'clinic_user.user_profile';
            Where[0].include[4] = 'branch.city';
            Where[0].include[5] = 'appointment_type';
            Where[0].include[6] = 'appointment_status';
            Where[0].include[7] = 'specialty_disease';
            Where[0].include[8] = 'prescription';
            Where[0].where = api_filter;
            Where[0].skip = $scope.skipvalue;
            Where[0].limit = $scope.itemsPerPage;
            params.filter = JSON.stringify(Where[0]);
            params.type = $state.params.type;
            ClinicAppointmentFactory.get(params).$promise.then(function (response) {
                if (response._metadata) {
                        $scope.currentPage = response._metadata.current_page;
                        $scope.lastPage = response._metadata.last_page;
                        $scope.itemsPerPage = 20;
                        $scope.totalRecords = response._metadata.total;
                        $scope.Perpage = response._metadata.per_page;
                    }
                $timeout(function () {
                    $scope.appointments = response.data;
                    $scope.isShown = (response.data.length > 0) ? true : false;
                    $scope._metadata = response._metadata;
                    $scope.loader = false;
                    if (angular.isDefined($scope.appointments) && Object.keys($scope.appointments)
                    .length > 0) {
                        angular.forEach($scope.appointments, function (value) {
                            //if(doctor_id !== value.provider_user.id){
                            //  doctor_id = value.provider_user.id;
                                $scope.patients.push({
                                    "id": value.id,
                                    "user_id": value.user.id,
                                    "patient_id": value.user.patient_id,
                                    "specialty_id": value.specialty_id,
                                    "name": value.user.user_profile.display_name+ " - " + value.user.patient_id
                                });
                                patientCount += 1;
                            //}
                        });
                    } 
                    console.log($scope.patients);
                }, 500);        
            });
        }    
        function getPatientAppointment() {
            params.id = $state.params.appointment_id;
            params.filter = '{"include":{"0":"user.user_profile","1":"provider_user.user_profile","2":"clinic_user","3":"book_by_user.user_profile","4":"branch","5":"appointment_type","6":"appointment_status","7":"specialty_disease"}}';
            AppointmentView.get(params).$promise.then(function (response) {
                    $scope.appointment = response.data;
                    $scope.todayDateTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm');
                        
            });
        }    
        if ($state.current.name === 'ManageConsultations') {
            /* if() {

            } else if() {

            } */
            params = {};
            params.filter = '{"where":{"user_id":' + $rootScope.auth.id + '},"limit":'+$scope.itemsPerPage+',"skip":'+$scope.skipvalue+',"include":{"0":"specialty"}}';
            //getPatients(params);
        } 
        if ($state.current.name === 'MedicalHistory') {
            $scope.param_user_id = $state.params.id;
            params = {};
            params.filter = '{"where":{"user_id":' + $state.params.id + '},"limit":'+$scope.itemsPerPage+',"skip":'+$scope.skipvalue+',"include":{"0":"attachment"}}';
            getMedicalHistory(params);
        } 
        if ($state.current.name === 'MedicalHistoryAdd') {
             $scope.year = {
                start: '1975',
                end: new Date().getFullYear()
             };
             $scope.show = false;
             $scope.formFieldData = false;
             //getDoctors();
        }    
        if($state.current.name == 'MedicalHistoryEdit'){
            $scope.year = {
                start: '1975',
                end: new Date().getFullYear()
            };
            params = {};
            params.id = $state.params.id;
            params.filter = '{"include":{"0":"attachment"}}';
            MedicalHistoryAction.get(params).$promise.then(function(response){
                $scope.data = response.data;
                getSpecialties($rootScope.auth.id);
            });
        }
        if ($state.current.name === 'MedicalHistoryView') {
                params = {};
                params.filter = '{"where":{"user_id":' + $state.params.user_id + '},"include":{"0":"specialty","1":"attachment", "2": "user"}}';
                MedicalHistoryView.get(params).$promise.then(function (response) {
                    $scope.histories = response.data;
                });
        }
        if ($state.current.name === 'MedicalRecords') {
            $scope.currentPage = (angular.isDefined($state.params.page)) ? parseInt($state.params.page) : 1;
            $scope.skipvalue = $scope.itemsPerPage !== undefined ? ($scope.currentPage - 1) * $scope.itemsPerPage : 0;
            $scope.itemsPerPage = $scope.itemsPerPage !== undefined ? $scope.itemsPerPage : 0;
            getAppointments();
        }    
        if ($state.current.name === 'MedicalRecordView') {
            params = {};
            params.filter = '{"where":{"user_id":' + $state.params.user_id + ', "specialty_id":' + $state.params.specialty_id + '},"include":{"0":"specialty", "1":"attachment", "2": "user.user_profile"}}';
            MedicalHistory.get(params).$promise.then(function (response) {
                $scope.medical_history = response.data[0];
            });
            getPatientFormData($state.params.appointment_id);
            getPatientAppointment();
        }
        
        /**
         * @ngdoc method
         * @name paginate
         * @methodOf appointments.controller:MedicalHistoryController
         * @description
         *
         * This method will be load pagination the pages.
         **/
        $scope.paginate = function() {
            $scope.currentPage = parseInt($scope.currentPage);
            $scope.getMedicalHistory();
            $('html, body').stop(true, true).animate({
                scrollTop: 0
            }, 600);
        };
        $scope.index();
        /*multiple image file upload */
        $scope.$on('MulitpleUploader', function(event, data) {
            $scope.imagedata = data;
            $scope.image = [];
        });

        $scope.medicalHistoryAdd = function ($valid){
            $scope.error = false;
            if ($valid && $scope.imagedata !== undefined) {
                if (angular.isDefined($scope.imagedata) && Object.keys($scope.imagedata)
                    .length > 0) {
                    $scope.data.medical_history_image = [];
                    angular.forEach($scope.imagedata, function(img) {
                        angular.forEach(img, function(report) {
                            if (report.attachment !== undefined) {
                                $scope.data.medical_history_image.push({"image": report.attachment });
                            }
                        });
                    });
                }
                $scope.data.user_id = $rootScope.auth.id;
                MedicalHistory.post($scope.data).$promise.then(function (response){
                    if(response.error.code === 0){
                        $state.go('MedicalHistory', { 'id': $rootScope.state_params.id, 'slug':  $rootScope.state_params.slug, 'info': 'medical_history' }, { reload: true });
                        flash.set($filter("translate")("Medical History added successfully."), 'success', false);
                    }else{
                        flash.set($filter("translate")("Medical History added failure."), 'error', false);
                    }
                });
            } else {
                $scope.error = true;
            }
        }

        $scope.medicalHistoryUpdate = function ($valid, data) {
            console.log($scope.data.attachment.length); 
            $scope.error = false;
            if ($valid && ($scope.imagedata !== undefined || $scope.data.attachment.length !== 0)) {
                if (angular.isDefined($scope.imagedata) && Object.keys($scope.imagedata)
                    .length > 0) {
                    $scope.data.medical_history_image = [];
                    angular.forEach($scope.imagedata, function(img) {
                        angular.forEach(img, function(report) {
                            if (report.attachment !== undefined) {
                                $scope.data.medical_history_image.push({"image": report.attachment });
                            }
                        });
                    });
                }
                var medicalHistoryData = {};
                medicalHistoryData.id = $state.params.id;
                medicalHistoryData.specialty_id = data.specialty_id;
                medicalHistoryData.years = data.years;
                medicalHistoryData.description = data.description;
                medicalHistoryData.medical_history_image =$scope.data.medical_history_image;
                medicalHistoryData.is_active = 1;
                MedicalHistoryAction.put(medicalHistoryData).$promise.then(function(response){
                    if(response.error.code === 0){
                        $state.go('MedicalHistory');
                        flash.set($filter("translate")("Medical History updated successfully."), 'success', false);
                    }else{
                        flash.set($filter("translate")("Medical History updated failure."), 'error', false);
                    }
                });
            } else {
                $scope.error = true;
            }  
        }

        /* $scope.MedicalHistoryDelete = function (id) {
             SweetAlert.swal({
                title: "Are you sure to Delete?",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55", confirmButtonText: "Yes",
                cancelButtonText: "No",
                closeOnConfirm: true,
                closeOnCancel: true
            },
            function (isConfirm) {
                if (isConfirm) {
                    MedicalHistoryDeleteFactory.delete({id: id}).$promise.then(function (response) {
                       $state.go('MedicalHistory',{ reload: true });
                       flash.set($filter("translate")("Medical History deleted successfully"), 'success', true); 
                    }, function (error) {
                        flash.set($filter("translate")("Medical History could not be deleted"), 'error', false);
                    });
                }
            });
        }; */

        $scope.MedicalHistoryDelete = function (id) {
            SweetAlert.swal({
                title: $filter("translate")("Are you sure you want to delete this report?"),
                text: "",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: $filter("translate")("OK"),
                cancelButtonText: $filter("translate")("Cancel!"),
                closeOnConfirm: true,
                animation: false,
            }, function (isConfirm) {
                 if(isConfirm === true) {  
                    MedicalHistoryAction.delete({
                        id: id
                    }, function (response) {
                        if (response.error.code === 0) {
                            $state.go('MedicalHistory',{ reload: true });
                            $state.reload();
                            flash.set($filter("translate")("Your medical report has been deleted successfully."), 'success', false);
                        } else {
                            flash.set($filter("translate")("Your medical report couldn't deleted. Please try again."), 'error', false);
                        }
                        
                    });
                 }    
            });
        }

        $scope.RemoveMedicalReport = function (attachmentId) {
            SweetAlert.swal({
                title: $filter("translate")("Are you sure you want to remove this report?"),
                text: "",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: $filter("translate")("OK"),
                cancelButtonText: $filter("translate")("Cancel!"),
                closeOnConfirm: true,
                animation: false,
            }, function (isConfirm) {
                 if(isConfirm === true) {  
                    AttachmentDelete.delete({
                        attachmentId: attachmentId
                    }, function (response) {
                        if (response.error.code === 0) {
                            flash.set($filter("translate")("Your medical report has been deleted successfully."), 'success', false);
                            $scope.index();
                        } else {
                            flash.set($filter("translate")("Your medical report couldn't deleted. Please try again."), 'error', false);
                            $scope.index();
                        }
                        
                    });
                 }    
            });
        }

        $scope.setDoctor = function (user_id) {
            $scope.show = true;
            var userId = user_id.split('/');
            if(userId[0] !== '0') {
                $rootScope.appointment_id = userId[1];
            } else {
                $rootScope.appointment_id = '';
            }   
            getSpecialties(userId[0]);
        }
        
        $scope.setSpecialty = function (user_id, specialty_id) {
            if(user_id !== '' && specialty_id !== '') {
                $scope.formFieldData = true;
                var userId = user_id.split('/');
                if(userId[0] !== '0') {
                    $rootScope.appointment_id = userId[1];
                } else {
                    $rootScope.appointment_id = '';
                }
                getSpecialtyFormData(userId[0], specialty_id);
            } else {
                $scope.formFieldData = false;
            }
        }

        $scope.getMedicalHistory = function (medicalhistory) {
            var medical_history = medicalhistory.split('/');
            $state.go('MedicalRecordView', {
                user_id: medical_history[0],
                specialty_id: medical_history[1],
                appointment_id: medical_history[2]
            });   
            
        }
    });
 