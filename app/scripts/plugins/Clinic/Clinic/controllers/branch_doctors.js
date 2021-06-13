'use strict';
/**
 * @ngdoc function
 * @name abs.controller:BranchesController
 * @description
 * # BranchesController
 * Controller of the abs
 */
angular.module('abs')

.controller('BranchesDoctorsController', function($state, $rootScope, $scope, $filter, $location, $timeout, flash,  MyDoctorsFactory, SweetAlert, RemoveDoctor, BranchesEdit, UserById, AppoinmentSettingsService, AppoinmentModificationService,splitedTimeSlot, AppoinmentModifications){
    $scope.index = function () {
        $rootScope.pageTitle = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("My Doctors");
        $scope.branch_id = $state.params.branch_id;
        $scope.user_id = $state.params.user_id;
        getDoctorById($state.params.user_id);
        $timeout(function () {
            $scope.text_box = true;
        }, 1000);
    };
     $scope.index(); 
      var params = {};   
      $scope.maxSize = 5;
      $scope.lastPage = 1;
      $scope.itemsPerPage = 20;    
   /**
     * @ngdoc method
     * @name BranchesController.branch
     * @methodOf module.BranchesController
     * @description
     * This method is used to get the clinic branches listing
    */
    $scope.loader = true;
    $scope.mydoctors = function() {
        var params = {};
        $scope.branch_id = $state.params.branch_id;

          $scope.currentPage = (angular.isDefined($state.params.page)) ? parseInt($state.params.page) : 1;
          $scope.skipvalue = $scope.itemsPerPage !== undefined ? ($scope.currentPage - 1) * $scope.itemsPerPage : 0;
          $scope.itemsPerPage = $scope.itemsPerPage !== undefined ? $scope.itemsPerPage : 0;

        if($state.current.name === 'my_doctors') {
            params.filter = '{"where":{"clinic_user_id":' + $rootScope.auth.id + '},"include":{"0":"branch","1":"user","2":"user.user_profile","3":"user.attachment","4":"user.user_profile.city","5":"user.user_profile.country","6":"appointment_settings","7":"appointment_modifications", "8":"branch.country","9":"branch.city"},"limit":'+$scope.itemsPerPage+',"skip":'+$scope.skipvalue+'}';

        } else {
            params.filter = '{"where":{"clinic_user_id":' + $rootScope.auth.id + ', "branch_id":'+ $scope.branch_id +'},"include":{"0":"branch","1":"user","2":"user.user_profile","3":"user.attachment","4":"user.user_profile.city","5":"user.user_profile.country","6":"appointment_settings","7":"appointment_modifications","8":"branch.country","9":"branch.city"},"limit":'+$scope.itemsPerPage+',"skip":'+$scope.skipvalue+'}';

        }     
        if($state.params.page === undefined) {
            params.page = 1;
        } else {
            params.page = $state.params.page;
        }  
        MyDoctorsFactory.get(params, function(response) {
           if (response._metadata) {
                    $scope.currentPage = response._metadata.current_page;
                    $scope.lastPage = response._metadata.last_page;
                    $scope.itemsPerPage = 20;
                    $scope.totalRecords = response._metadata.total;
                    $scope.Perpage = response._metadata.per_page;
                }
            if (angular.isDefined(response.data)) {
                $scope.doctors = response.data;
                $scope.dataLength = (response.data.length > 0) ? true : false;
            }
            $scope.loader = false;
        });
        getBranchById($scope.branch_id);
    };
    $scope.mydoctors();
     /**
     * @ngdoc method
     * @name BranchesController.paginate
     * @methodOf module.BranchesController
     * @description
     * This method is used to get the branch listing
     */
     $scope.paginate_search = function (element, currentPage) {
            $scope.currentPage = currentPage;
            $location.search('page', currentPage);
            $('html, body').stop().animate({ scrollTop: 0 }, 1000, 'swing', false);
            $timeout(function () {
                /*$scope.search(element);*/
                $scope.mydoctors();
            }, 1000);
        };
     /**
     * @ngdoc method
     * @name BranchesController.delete
     * @methodOf module.BranchesController
     * @description
     * This method is used to remove the doctor from the branch listing
     */
     $scope.removeDoctor = function (branch_doctor_id) {
            SweetAlert.swal({
                title: $filter("translate")("Are you sure you want to remove the doctor from branch list?"),
                text: "",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: $filter("translate")("OK"),
                cancelButtonText: $filter("translate")("Cancel!"),
                closeOnConfirm: true,
                animation: false,
            }, function (isConfirm) {
                if(isConfirm === true) {
                    RemoveDoctor.delete({
                        id: branch_doctor_id
                    }, function (response) {
                        if (response.error.code === 0) {
                            flash.set($filter("translate")("Your doctor has been deleted successfully."), 'success', false);
                            $state.reload();
                        } else {
                            flash.set($filter("translate")("Your doctor couldn't deleted. Please try again."), 'error', false);
                            $state.reload();
                        }
                    });
                } 
            });
        }
        /* [ GET - Appoinment Modification ] */
        function getAppoinmentModification(branch_id,user_id){
            var params ={};
            params.filter = '{"where":{"branch_id":'+ branch_id +',"user_id":'+ user_id +'}}'; 
            AppoinmentModificationService.get(params).$promise.then(function (response) {
                    $scope.appoinmentModification = response.data;
					$scope.dataLength = (response.data.length > 0) ? true : false;                      
            }); 
        }
        /* [ GET - Appoinment Modification By Id ] */
        function getAppoinmentModificationById(id){            
            AppoinmentModificationService.getbyid({id : id}).$promise.then(function (response) {
                if(angular.isDefined(response)){
					$scope.appoinmentmodification_update = response;
					$scope.appoinmentmodification_update.type = parseInt(response.type);
					if(response.practice_open !==''){
						var practiceOpen = response.practice_open;
						$scope.appoinmentmodification_update.appt_time = practiceOpen.split(',');

					}else{
						$scope.appoinmentmodification_update.appt_time = '';
					}
                    $scope.dataModificationLength = (response.length > 0) ? true : false;                      
                }                              
            }); 
        }
        /* [ PUT - Appoinment Modification ] */  
        function updateAppoinmentModification(id,data){
			AppoinmentModificationService.put({id:id},data).$promise.then(function (response) {
                if(angular.isDefined(response)){
                    /* [ Success Response ] */
                    if(response.Success){
                        $timeout(function(){
                            $state.go(ConstantWorkPlaces.state_AppoinmentModification,{'locationid':$state.params.locationid},{reload:true});  
                        },500);                        
                        flashMessage("Appoinment modification updated successfully",'success');   
                    } else {
                        flashMessage("Please try again",'error');   
                    }
                }                              
            });
        }
        /* [ POST - Appoinment Modification ] */
        function addAppoinmentModification(data){			
            AppoinmentModificationService.post(data).$promise.then(function (response) {
				if(angular.isDefined(response)){
                    /* [ Success Response ] */
                    if(response.error.code===0){
                        $timeout(function(){
                            $state.go('appointment_modification',{'branch_id':$state.params.branch_id,'user_id':$state.params.user_id,'apt_set_id':$state.params.apt_set_id},{reload:true});  
                        },500);
                        flash.set($filter("translate")("Appoinment modification added successfully."), 'success', true);
                    } else if(response.Failed) {
                        flash.set($filter("translate")("Please try again."), 'error', false);   
                    } else {
						flash.set($filter("translate")("Please try again."), 'error', false);   
					}
						
                }                              
            });
        }        
        /* [ DELETE { Workplace, Appoinments, Appoinment modification } ] */
        function fnDeleteWorkPlace(id){
            SweetAlert.swal({
                    title: $filter("translate")("Are you sure to want to delete?"),
                    text: "",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: $filter("translate")("Confirm"),
                    cancelButtonText: $filter("translate")("No"),
                    closeOnConfirm: true,
                    closeOnCancel: true
            },
            function (isConfirm) {
                /* [ Delete the work Location Data ] */
                    AppoinmentModifications.delete({id: id}).$promise.then(function (response) {
                        flash.set($filter("translate")("Appoinment modification deleted successfully."), 'success', true);
                        $timeout(function(){
                            $state.reload();
                        },500);
                    }, function (error) {
                        flash.set($filter("translate")("Appoinment modification could not be deleted, Please try again."), 'error', false);
                    });
            });
        }
        /* [ GET - Splited Time Slot ] */
        function getTimeSlot(apt_settings_id){
            params.apt_settings_id = apt_settings_id;
            splitedTimeSlot.get(params).$promise.then(function (response) {
                if(angular.isDefined(response)){
                    $scope.timeSlot = response.data;
                    $scope.timeSlotLength = (response.data.length > 0) ? true : false;                      
                }                              
            }); 
        }
        /* [ GET - branch by Id ] */  
        function getBranchById(id){
            var params = {};
            params.id = id;
            params.filter = '{"fields":{"id":true,"name":true}}';
            BranchesEdit.get(params).$promise.then(function (response) {
                if(angular.isDefined(response)){
                    if (response.Failed) {
                        flashMessage(response.Failed,'error');
                    } else {
                        $scope.branch = response.data; 
                    }                                                            
                }                              
            });
        }
        /* [ GET - user by Id ] */
        function getDoctorById(id){
            var params = {};
            params.id = id;
            params.filter = '{"fields":{"id":true,"username":true}}';
            UserById.get(params).$promise.then(function (response) {
                if(angular.isDefined(response)){
                    if (response.Failed) {
                        flashMessage(response.Failed,'error');
                    } else {
                        $scope.user = response.data; 
                    }                                                            
                }                              
            });
        } 
        /* [ Appoinment Settings ] */           
        function calendarSlots(){
                $scope.calendarSlots = [];
                $scope.calendarSlots.push({'id': 5, 'name': ('5 minutes')},{'id': 10, 'name':('10 minutes')},{'id': 15, 'name':('15 minutes')},{'id': 20, 'name':('20  minutes')},{'id': 25, 'name':('25 minutes')},{'id': 30, 'name':('30 minutes')},{'id': 35, 'name':('35 minutes')},{'id': 40, 'name':('40 minutes')},{'id': 45, 'name':('45 minutes')},{'id': 50, 'name':('50 minutes')},{'id': 55, 'name':('55 minutes')},{'id': 60, 'name':('60 minutes')}
                );
        }
        /* [ Appointment Settings Response Check for Day ] */
        function checkASettingsResponse(value){
            return (parseInt(value) === 1) ? true : false;
        }
        /* [ Appointment Settings Time Format ] */
        function changeTimeFormat(value){
            return (value) ? '1970-01-01T'+$filter('date')(value, 'HH:mm') : null;
        }
        /* [ Appointment Settings Time Format ] */
        function updateTimeFormat(value){
            return (value) ? $filter('date')(value, 'HH:mm:ss') : null;
        }
        /* [ Get Appoinenement Settings Data by location id ] */
        function getAppointmentSettingsData(branchid,userid,apt_set_id){
            params.filter = '{"where":{"branch_id":'+ branchid +',"user_id":'+ userid +',"id":'+ apt_set_id +'}}';
            AppoinmentSettingsService.get(params).$promise.then(function (response) {
                if(angular.isDefined(response)){
                    $scope.settingValue = response.data[0];
                    $scope.settingValue.calendar_slot_id = parseInt(response.data[0].calendar_slot_id);
                    $scope.settingValue.is_today_first_day = checkASettingsResponse(response.data[0].is_today_first_day);
                    $scope.settingValue.is_two_session = checkASettingsResponse(response.data[0].is_two_session);
                  
                    $scope.settingValue.practice_open = changeTimeFormat(response.data[0].practice_open);
                    $scope.settingValue.practice_close = changeTimeFormat(response.data[0].practice_close);
                    $scope.settingValue.lunch_at = changeTimeFormat(response.data[0].lunch_at);
                    $scope.settingValue.resume_at = changeTimeFormat(response.data[0].resume_at);

                    $scope.settingValue.sunday_practice_open = changeTimeFormat(response.data[0].sunday_practice_open);
                    $scope.settingValue.sunday_practice_close = changeTimeFormat(response.data[0].sunday_practice_close);
                    $scope.settingValue.sunday_lunch_at = changeTimeFormat(response.data[0].sunday_lunch_at);
                    $scope.settingValue.sunday_resume_at = changeTimeFormat(response.data[0].sunday_resume_at);

                    $scope.settingValue.monday_practice_open = changeTimeFormat(response.data[0].monday_practice_open);
                    $scope.settingValue.monday_practice_close = changeTimeFormat(response.data[0].monday_practice_close);
                    $scope.settingValue.monday_lunch_at = changeTimeFormat(response.data[0].monday_lunch_at);
                    $scope.settingValue.monday_resume_at = changeTimeFormat(response.data[0].monday_resume_at);

                    $scope.settingValue.tuesday_practice_open = changeTimeFormat(response.data[0].tuesday_practice_open);
                    $scope.settingValue.tuesday_practice_close = changeTimeFormat(response.data[0].tuesday_practice_close);
                    $scope.settingValue.tuesday_lunch_at = changeTimeFormat(response.data[0].tuesday_lunch_at);
                    $scope.settingValue.tuesday_resume_at = changeTimeFormat(response.data[0].tuesday_resume_at);

                    $scope.settingValue.wednesday_practice_open = changeTimeFormat(response.data[0].wednesday_practice_open);
                    $scope.settingValue.wednesday_practice_close = changeTimeFormat(response.data[0].wednesday_practice_close);
                    $scope.settingValue.wednesday_lunch_at = changeTimeFormat(response.data[0].wednesday_lunch_at);
                    $scope.settingValue.wednesday_resume_at = changeTimeFormat(response.data[0].wednesday_resume_at);

                    $scope.settingValue.thursday_practice_open = changeTimeFormat(response.data[0].thursday_practice_open);
                    $scope.settingValue.thursday_practice_close = changeTimeFormat(response.data[0].thursday_practice_close);
                    $scope.settingValue.thursday_lunch_at = changeTimeFormat(response.data[0].thursday_lunch_at);
                    $scope.settingValue.thursday_resume_at = changeTimeFormat(response.data[0].thursday_resume_at);

                    $scope.settingValue.friday_practice_open = changeTimeFormat(response.data[0].friday_practice_open);
                    $scope.settingValue.friday_practice_close = changeTimeFormat(response.data[0].friday_practice_close);
                    $scope.settingValue.friday_lunch_at = changeTimeFormat(response.data[0].friday_lunch_at);
                    $scope.settingValue.friday_resume_at = changeTimeFormat(response.data[0].friday_resume_at);

                    $scope.settingValue.saturday_practice_open = changeTimeFormat(response.data[0].saturday_practice_open);
                    $scope.settingValue.saturday_practice_close = changeTimeFormat(response.data[0].saturday_practice_close);
                    $scope.settingValue.saturday_lunch_at = changeTimeFormat(response.data[0].saturday_lunch_at);
                    $scope.settingValue.saturday_resume_at = changeTimeFormat(response.data[0].saturday_resume_at);

                    $scope.settingValue.type = checkASettingsResponse(response.data[0].type);
                    $scope.settingValue.is_sunday_open = checkASettingsResponse(response.data[0].is_sunday_open);
                    $scope.settingValue.sunday_two_session = checkASettingsResponse(response.data[0].sunday_two_session);
                    $scope.settingValue.is_monday_open = checkASettingsResponse(response.data[0].is_monday_open);
                    $scope.settingValue.monday_two_session = checkASettingsResponse(response.data[0].monday_two_session);
                    $scope.settingValue.is_tuesday_open = checkASettingsResponse(response.data[0].is_tuesday_open);
                    $scope.settingValue.tuesday_two_session = checkASettingsResponse(response.data[0].tuesday_two_session);
                    $scope.settingValue.is_wednesday_open = checkASettingsResponse(response.data[0].is_wednesday_open);
                    $scope.settingValue.wednesday_two_session = checkASettingsResponse(response.data[0].wednesday_two_session);
                    $scope.settingValue.is_thursday_open = checkASettingsResponse(response.data[0].is_thursday_open);
                    $scope.settingValue.thursday_two_session = checkASettingsResponse(response.data[0].thursday_two_session);
                    $scope.settingValue.is_friday_open = checkASettingsResponse(response.data[0].is_friday_open);
                    $scope.settingValue.friday_two_session = checkASettingsResponse(response.data[0].friday_two_session);
                    $scope.settingValue.is_saturday_open = checkASettingsResponse(response.data[0].is_saturday_open);
                    $scope.settingValue.saturday_two_session = checkASettingsResponse(response.data[0].saturday_two_session);
                    $scope.settingValue.is_active  = checkASettingsResponse(response.data[0].is_active); 
                }
            });
        }
        /* [ Appointment Settings Save ] */
        function updateAppointmnetSettings(data){
            delete data.created_at;
            delete data.updated_at;  
            //All Day
            data.practice_open  = updateTimeFormat(data.practice_open);
            data.practice_close = updateTimeFormat(data.practice_close);
            data.lunch_at = updateTimeFormat(data.lunch_at); 
            data.resume_at = updateTimeFormat(data.resume_at);

            data.sunday_practice_open  = updateTimeFormat(data.sunday_practice_open);
            data.sunday_practice_close = updateTimeFormat(data.sunday_practice_close);
            data.sunday_lunch_at = updateTimeFormat(data.sunday_lunch_at); 
            data.sunday_resume_at = updateTimeFormat(data.sunday_resume_at);

            data.monday_practice_open  = updateTimeFormat(data.monday_practice_open);
            data.monday_practice_close = updateTimeFormat(data.monday_practice_close);
            data.monday_lunch_at = updateTimeFormat(data.monday_lunch_at); 
            data.monday_resume_at = updateTimeFormat(data.monday_resume_at);

            data.tuesday_practice_open  = updateTimeFormat(data.tuesday_practice_open);
            data.tuesday_practice_close = updateTimeFormat(data.tuesday_practice_close);
            data.tuesday_lunch_at = updateTimeFormat(data.tuesday_lunch_at); 
            data.tuesday_resume_at = updateTimeFormat(data.tuesday_resume_at);

            data.wednesday_practice_open  = updateTimeFormat(data.wednesday_practice_open);
            data.wednesday_practice_close = updateTimeFormat(data.wednesday_practice_close);
            data.wednesday_lunch_at = updateTimeFormat(data.wednesday_lunch_at); 
            data.wednesday_resume_at = updateTimeFormat(data.wednesday_resume_at);

            data.thursday_practice_open  = updateTimeFormat(data.thursday_practice_open);
            data.thursday_practice_close = updateTimeFormat(data.thursday_practice_close);
            data.thursday_lunch_at = updateTimeFormat(data.thursday_lunch_at); 
            data.thursday_resume_at = updateTimeFormat(data.thursday_resume_at);

            data.friday_practice_open  = updateTimeFormat(data.friday_practice_open);
            data.friday_practice_close = updateTimeFormat(data.friday_practice_close);
            data.friday_lunch_at = updateTimeFormat(data.friday_lunch_at); 
            data.friday_resume_at = updateTimeFormat(data.friday_resume_at);

            data.saturday_practice_open  = updateTimeFormat(data.saturday_practice_open);
            data.saturday_practice_close = updateTimeFormat(data.saturday_practice_close);
            data.saturday_lunch_at = updateTimeFormat(data.saturday_lunch_at); 
            data.saturday_resume_at = updateTimeFormat(data.saturday_resume_at);

            AppoinmentSettingsService.put(data).$promise.then(function (response) {
                if (parseInt(response.error.code) === 0) {            
                        $scope.open_lunch = $scope.resume_close = $scope.lunch_resume = $scope.open_close = $scope.sunday_open_lunch = $scope.sunday_resume_close = $scope.sunday_lunch_resume = $scope.sunday_open_close = $scope.monday_open_lunch = $scope.monday_resume_close = $scope.monday_lunch_resume = $scope.monday_open_close = $scope.tuesday_open_lunch = $scope.tuesday_resume_close = $scope.tuesday_lunch_resume = $scope.tuesday_open_close = $scope.wednesday_open_lunch = $scope.wednesday_resume_close = $scope.wednesday_lunch_resume = $scope.wednesday_open_close = $scope.thursday_open_lunch = $scope.thursday_resume_close = $scope.thursday_lunch_resume = $scope.thursday_open_close = $scope.friday_open_lunch = $scope.friday_resume_close = $scope.friday_lunch_resume = $scope.friday_open_close = $scope.saturday_open_lunch = $scope.saturday_resume_close = $scope.saturday_lunch_resume = $scope.saturday_open_close = false;
                        $timeout(function(){
                             $state.go('branch_doctors',{'branch_id':response.data.branch.id},{reload:true});  
                        },500);  
                        flash.set($filter("translate")("Appoinment Settings updated successfully."), 'success', true);
                } else {
                    flash.set($filter("translate")(response.error.message), 'error', false);
                } 
             }, function(response) {
                 $scope.settingValue.practice_open = changeTimeFormat($scope.settingValue.practice_open);
                 $scope.settingValue.practice_close = changeTimeFormat($scope.settingValue.practice_close);
                 
                 $scope.error = response.data.error.fields;
                 if($scope.settingValue.type){
                        /* Sunday */
                        if($scope.settingValue.is_sunday_open){
                            if($scope.settingValue.sunday_two_session){
                                if ($scope.error.sunday_open_lunch !== undefined) {
                                    $scope.sunday_open_lunch = $filter("translate")($scope.error.sunday_open_lunch);
                                } else {
                                    $scope.sunday_open_lunch = false;
                                }
                                if ($scope.error.sunday_lunch_resume !== undefined) {
                                    $scope.sunday_lunch_resume = $filter("translate")($scope.error.sunday_lunch_resume);
                                } else {
                                    $scope.sunday_lunch_resume = false;
                                }
                                if ($scope.error.sunday_resume_close !== undefined) {
                                    $scope.sunday_resume_close = $filter("translate")($scope.error.sunday_resume_close);
                                } else {
                                    $scope.sunday_resume_close = false;
                                }
                            } else {
                                $scope.sunday_resume_close = false;
                                if ($scope.error.sunday_open_close !== undefined) {
                                    $scope.sunday_open_close = $filter("translate")($scope.error.sunday_open_close);
                                } else {
                                    $scope.sunday_open_close = false;
                                }
                            }
                        }
                        /* Monday */
                        if($scope.settingValue.is_monday_open){
                            if($scope.settingValue.monday_two_session){
                                if ($scope.error.monday_open_lunch !== undefined) {
                                    $scope.monday_open_lunch = $filter("translate")($scope.error.sunday_open_lunch);
                                } else {
                                    $scope.monday_open_lunch = false;
                                }
                                if ($scope.error.monday_lunch_resume !== undefined) {
                                    $scope.monday_lunch_resume = $filter("translate")($scope.error.monday_lunch_resume);
                                } else {
                                    $scope.monday_lunch_resume = false;
                                }
                                if ($scope.error.monday_resume_close !== undefined) {
                                    $scope.monday_resume_close = $filter("translate")($scope.error.monday_resume_close);
                                } else {
                                    $scope.monday_resume_close = false;
                                }
                            } else {
                                $scope.monday_resume_close = false;
                                if ($scope.error.monday_open_close !== undefined) {
                                    $scope.monday_open_close = $filter("translate")($scope.error.monday_open_close);
                                } else {
                                    $scope.monday_open_close = false;
                                }
                            }
                        }
                        /* Tuesday */
                        if($scope.settingValue.is_tuesday_open){
                            if($scope.settingValue.tuesday_two_session){
                                if ($scope.error.tuesday_open_lunch !== undefined) {
                                    $scope.tuesday_open_lunch = $filter("translate")($scope.error.tuesday_open_lunch);
                                } else {
                                    $scope.tuesday_open_lunch = false;
                                }
                                if ($scope.error.tuesday_lunch_resume !== undefined) {
                                    $scope.tuesday_lunch_resume = $filter("translate")($scope.error.tuesday_lunch_resume);
                                } else {
                                    $scope.tuesday_lunch_resume = false;
                                }
                                if ($scope.error.tuesday_resume_close !== undefined) {
                                    $scope.tuesday_resume_close = $filter("translate")($scope.error.tuesday_resume_close);
                                } else {
                                    $scope.tuesday_resume_close = false;
                                }
                            } else {
                                $scope.tuesday_resume_close = false;
                                if ($scope.error.tuesday_open_close !== undefined) {
                                    $scope.tuesday_open_close = $filter("translate")($scope.error.tuesday_open_close);
                                } else {
                                    $scope.tuesday_open_close = false;
                                }
                            }
                        }
                        /* Wednesday */
                        if($scope.settingValue.is_wednesday_open){
                            if($scope.settingValue.wednesday_two_session){
                                if ($scope.error.wednesday_open_lunch !== undefined) {
                                    $scope.wednesday_open_lunch = $filter("translate")($scope.error.wednesday_open_lunch);
                                } else {
                                    $scope.wednesday_open_lunch = false;
                                }
                                if ($scope.error.wednesday_lunch_resume !== undefined) {
                                    $scope.wednesday_lunch_resume = $filter("translate")($scope.error.wednesday_lunch_resume);
                                } else {
                                    $scope.wednesday_lunch_resume = false;
                                }
                                if ($scope.error.wednesday_resume_close !== undefined) {
                                    $scope.wednesday_resume_close = $filter("translate")($scope.error.wednesday_resume_close);
                                } else {
                                    $scope.wednesday_resume_close = false;
                                }
                            } else {
                                $scope.wednesday_resume_close = false;
                                if ($scope.error.wednesday_open_close !== undefined) {
                                    $scope.wednesday_open_close = $filter("translate")($scope.error.wednesday_open_close);
                                } else {
                                    $scope.wednesday_open_close = false;
                                }
                            }
                        }
                        /* Thursday */
                        if($scope.settingValue.is_thursday_open){
                            if($scope.settingValue.thursday_two_session){
                                if ($scope.error.thursday_open_lunch !== undefined) {
                                    $scope.thursday_open_lunch = $filter("translate")($scope.error.thursday_open_lunch);
                                } else {
                                    $scope.thursday_open_lunch = false;
                                }
                                if ($scope.error.thursday_lunch_resume !== undefined) {
                                    $scope.thursday_lunch_resume = $filter("translate")($scope.error.thursday_lunch_resume);
                                } else {
                                    $scope.thursday_lunch_resume = false;
                                }
                                if ($scope.error.thursday_resume_close !== undefined) {
                                    $scope.thursday_resume_close = $filter("translate")($scope.error.thursday_resume_close);
                                } else {
                                    $scope.thursday_resume_close = false;
                                }
                            } else {
                                $scope.thursday_resume_close = false;
                                if ($scope.error.thursday_open_close !== undefined) {
                                    $scope.thursday_open_close = $filter("translate")($scope.error.thursday_open_close);
                                } else {
                                    $scope.thursday_open_close = false;
                                }
                            }
                        }
                        /* Friday */
                        if($scope.settingValue.is_friday_open){
                            if($scope.settingValue.friday_two_session){
                                if ($scope.error.friday_open_lunch !== undefined) {
                                    $scope.friday_open_lunch = $filter("translate")($scope.error.friday_open_lunch);
                                } else {
                                    $scope.friday_open_lunch = false;
                                }
                                if ($scope.error.friday_lunch_resume !== undefined) {
                                    $scope.friday_lunch_resume = $filter("translate")($scope.error.friday_lunch_resume);
                                } else {
                                    $scope.friday_lunch_resume = false;
                                }
                                if ($scope.error.friday_resume_close !== undefined) {
                                    $scope.friday_resume_close = $filter("translate")($scope.error.friday_resume_close);
                                } else {
                                    $scope.friday_resume_close = false;
                                }
                            } else {
                                $scope.friday_resume_close = false;
                                if ($scope.error.friday_open_close !== undefined) {
                                    $scope.friday_open_close = $filter("translate")($scope.error.friday_open_close);
                                } else {
                                    $scope.friday_open_close = false;
                                }
                            }
                        }
                        /* Saturday */
                        if($scope.settingValue.is_saturday_open){
                            if($scope.settingValue.saturday_two_session){
                                if ($scope.error.saturday_open_lunch !== undefined) {
                                    $scope.saturday_open_lunch = $filter("translate")($scope.error.saturday_open_lunch);
                                } else {
                                    $scope.saturday_open_lunch = false;
                                }
                                if ($scope.error.saturday_lunch_resume !== undefined) {
                                    $scope.saturday_lunch_resume = $filter("translate")($scope.error.saturday_lunch_resume);
                                } else {
                                    $scope.saturday_lunch_resume = false;
                                }
                                if ($scope.error.saturday_resume_close !== undefined) {
                                    $scope.saturday_resume_close = $filter("translate")($scope.error.saturday_resume_close);
                                } else {
                                    $scope.saturday_resume_close = false;
                                }
                            } else {
                                $scope.saturday_resume_close = false;
                                if ($scope.error.saturday_open_close !== undefined) {
                                    $scope.saturday_open_close = $filter("translate")($scope.error.saturday_open_close);
                                } else {
                                    $scope.saturday_open_close = false;
                                }
                            }
                        }
                   } else {
                        if($scope.settingValue.is_two_session){
                            if ($scope.error.open_lunch !== undefined) {
                                $scope.open_lunch = $filter("translate")($scope.error.open_lunch);
                            } else {
                                $scope.open_lunch = false;
                            }
                            if ($scope.error.lunch_resume !== undefined) {
                                $scope.lunch_resume = $filter("translate")($scope.error.lunch_resume);
                            } else {
                                $scope.lunch_resume = false;
                            }
                            if ($scope.error.resume_close !== undefined) {
                                $scope.resume_close = $filter("translate")($scope.error.resume_close);
                            } else {
                                $scope.resume_close = false;
                            }
                        } else {
                            $scope.resume_close = false;
                            if ($scope.error.open_close !== undefined) {
                                $scope.open_close = $filter("translate")($scope.error.open_close);
                            } else {
                                $scope.open_close = false;
                            }
                        }
                   }
                   flash.set($filter("translate")("Settings could not be added. Please, try again"), 'error', false);
            });
        }
        /* [ State {{AppoinmentSettings}} ] */    
        if($state.current.name === 'appointment_setting'){
            if(angular.isDefined($state.params.branch_id) && angular.isDefined($state.params.user_id)){
                    $scope.branch_id = $state.params.branch_id;
                    $scope.user_id = $state.params.user_id;
                    $scope.apt_set_id = $state.params.apt_set_id;             
                    getBranchById($scope.branch_id, $scope.user_id);
                    /* [ Appoinment Settings - List ] */  
                    calendarSlots();
                    getAppointmentSettingsData($scope.branch_id, $scope.user_id,$scope.apt_set_id);
                    /* [ Appoinment Settings - Update  ] */
                    $scope.settingUpdate = function($valid) {
                        if ($valid) {
                            $scope.is_disable = true;
                            $scope.settingValue.id = $scope.apt_set_id;
                            updateAppointmnetSettings($scope.settingValue);                        
                        }
                    };                
                    /* [ Delete ] */
                    $scope.deleteWorkPlace = function(id){
                        if(angular.isDefined(id)){
                            fnDeleteWorkPlace(id);
                        }
                    };
                } else {
                $state.go('branch_doctors');  
            }
        } else if($state.current.name === 'appointment_modification'){
            if(angular.isDefined($state.params.branch_id) && angular.isDefined($state.params.user_id)){
                $scope.branch_id = $state.params.branch_id; 
                $scope.user_id = $state.params.user_id;
                $scope.apt_set_id = $state.params.apt_set_id;             
                getBranchById($scope.branch_id, $scope.user_id);
                getAppoinmentModification($scope.branch_id, $scope.user_id);
                /* [ Delete ] */
                $scope.deleteWorkPlace = function(id){
                    if(angular.isDefined(id)){
						fnDeleteWorkPlace(id);
                    }
                };
            } else {
               $state.go(ConstantWorkPlaces.state_WorkPlace);  
            }
        } else if($state.current.name === 'appointment_modification_add'){
            if(angular.isDefined($state.params.branch_id) && angular.isDefined($state.params.user_id)){
                $scope.branch_id = $state.params.branch_id; 
                $scope.user_id = $state.params.user_id;
                $scope.apt_set_id = $state.params.apt_set_id;             
                getTimeSlot($scope.apt_set_id);
                $scope.type = false;
                /* [ Save Appoinment Modifications ] */
                $scope.saveAppoinmentModification = function(data){
                    $scope.settingValue = {};
                    $scope.settingValue.user_id = $scope.user_id;
                    $scope.settingValue.branch_id = $scope.branch_id;
                    $scope.settingValue.appoint_date = $filter('date')(data.appoint_date, "yyyy-MM-dd");
                    $scope.settingValue.appoint_date_end = $filter('date')(data.appoint_date_end, "yyyy-MM-dd");
                    if(!$scope.type) {
                        $scope.settingValue.practice_open = data.appt_time.toString();
                    }    
                    $scope.settingValue.type = $scope.type;
                    addAppoinmentModification($scope.settingValue);
                };
            }  
        } else if($state.current.name == 'appointment_modification_edit'){
            $rootScope.pageTitle = $rootScope.settings['site.name'] + " | " + $filter("translate")("Edit Modification Details");
            AppoinmentModifications.get({id: $state.params.id}).$promise.then(function (response) {
                $scope.data = response.data;
                $scope.data.country_id = parseInt(response.data.country_id);
                $scope.data.type = (response.data.type) ? true:false;
                if(response.data.practice_open !==''){
                    var practiceOpen = response.data.practice_open;
                    $scope.data.appt_time = practiceOpen.split(',');
                    
                }else{
                    $scope.data.appt_time = '';
                }
                getTimeSlot($state.params.apt_set_id);
            });
            $scope.updateAppoinmentModification = function(data){
                $scope.modifyValue = {};
                $scope.modifyValue.id = data.id;
                $scope.modifyValue.branch_id = $state.params.branch_id;
                $scope.modifyValue.user_id = $state.params.user_id;
                $scope.modifyValue.appoint_date = $filter('date')(data.appoint_date, "yyyy-MM-dd");
                $scope.modifyValue.appoint_date_end = $filter('date')(data.appoint_date_end, "yyyy-MM-dd");
                $scope.modifyValue.type = data.type;
                $scope.modifyValue.is_active = data.is_active;
                if(!data.type) {
                   $scope.modifyValue.practice_open = data.appt_time.toString();
                }
                AppoinmentModifications.put($scope.modifyValue).$promise.then(function (response) {
                    flash.set($filter("translate")("Appoinment modification added successfully."), 'success', true);
                    $state.go('appointment_modification',{'branch_id':$state.params.branch_id,'user_id':$state.params.user_id,'apt_set_id':$state.params.apt_set_id},{reload:true});
                });
            };
        }  
       $scope.changeType = function (value) {
           $scope.type = (value) ? false:true;
       };  
});   