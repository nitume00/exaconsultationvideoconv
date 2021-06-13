'use strict';
/**
 * @ngdoc function
 * @name abs.controller:ClinicDashboardController
 * @description
 * # ClinicDashboardController
 * Controller of the abs
 */
angular.module('abs')
    /**
     * @ngdoc controller
     * @name user.controller:ClinicDashboardController
     * @description
     *
     * This is user controller having the methods setmMetaData, init, upload and user_profile.
     **/
.controller('ClinicDashboardController', function ($scope, $state, $rootScope, $filter, $location, $auth, flash,$anchorScroll, $timeout, md5, ConstUserType, $uibModal, $uibModalStack, $cookies, SearchPatients, DoctorsFactory, AppointmentWeekList, BookingAppointmentDetails, ClinicAppointmentBookingAdd, ConstGenders){
        $rootScope.pageTitle = $rootScope.settings.SITE_NAME + " | " + $filter("translate")("Dashboard") + " | " + $state.params.slug;
        var params = {};
        var appointmetHide = '';
        var lessShow = '';
        var moreShow = '';
        $scope.maxSize = 5;
        $scope.appointment_timeslots = [];
        $scope.ConstUserType = ConstUserType;
        $scope.gotoAnchor = function(x) {
            $anchorScroll(x);
        };
        function daysAdd(slot_index){
            return {
                today: $scope.dateAddFunction(0, $scope.appointment_timeslots[slot_index].viewslot),
                day2: $scope.dateAddFunction(1, $scope.appointment_timeslots[slot_index].viewslot),
                day3: $scope.dateAddFunction(2, $scope.appointment_timeslots[slot_index].viewslot),
                day4: $scope.dateAddFunction(3, $scope.appointment_timeslots[slot_index].viewslot),
                day5: $scope.dateAddFunction(4, $scope.appointment_timeslots[slot_index].viewslot),
                day6: $scope.dateAddFunction(5, $scope.appointment_timeslots[slot_index].viewslot),
                day7: $scope.dateAddFunction(6, $scope.appointment_timeslots[slot_index].viewslot)
            };
        }
        function daysAddIntially() {
            return {
                today: $scope.dateAddFunction(0, $scope.viewslot),
                day2: $scope.dateAddFunction(1, $scope.viewslot),
                day3: $scope.dateAddFunction(2, $scope.viewslot),
                day4: $scope.dateAddFunction(3, $scope.viewslot),
                day5: $scope.dateAddFunction(4, $scope.viewslot),
                day6: $scope.dateAddFunction(5, $scope.viewslot),
                day7: $scope.dateAddFunction(6, $scope.viewslot)
            };
        }
         $scope.showDetail = function (e, doctorInfo) {
            $scope.map ={};
            $scope.doctorInfo = doctorInfo;
            $scope.map.showInfoWindow('doctor-info', doctorInfo.id);
        };
        /**
         * @ngdoc method
         * @name init
         * @methodOf user.controller:UserController
         * @description
         * This method will initialze the page. It returns the page title.
         *
         **/
        $scope.init = function () {
            $scope.currentPage = ($scope.currentPage !== undefined) ? parseInt($scope.currentPage) : 1;
        };

        $scope.GetAppointmentSlots = function(appointment_settings_id,branch_id,doctor_user_id) {
                /* For Show More Concept */
                $scope.loadMore = function() {
                    /* for appointment enable */
                    appointmetHide = angular.element(document.getElementsByClassName('showmore'));
                    if(appointmetHide.hasClass('hide')){
                        appointmetHide.removeClass('hide');
                        appointmetHide.addClass('show');
                    }
                    /* For show less more button */
                    var moreShow = angular.element(document.getElementsByClassName('showmore_btn'));
                    if(moreShow.hasClass('show')){
                        moreShow.removeClass('show');
                        moreShow.addClass('hide');
                    }
                    var lessShow = angular.element(document.getElementsByClassName('showless_btn'));
                    if(lessShow.hasClass('hide')) {
                        lessShow.addClass('show');
                        lessShow.removeClass('hide');
                    }
                };

                $scope.showLess = function(){
                    /* for appointment enable */
                    appointmetHide = angular.element(document.getElementsByClassName('showmore'));
                    if(appointmetHide.hasClass('show')){
                        appointmetHide.removeClass('show');
                        appointmetHide.addClass('hide');
                    }
                    /* For show less more button */
                    moreShow = angular.element(document.getElementsByClassName('showmore_btn'));
                    if(moreShow.hasClass('hide')){
                        moreShow.removeClass('hide');
                        moreShow.addClass('show');
                    }
                    lessShow = angular.element(document.getElementsByClassName('showless_btn'));
                    if(lessShow.hasClass('show')) {
                        lessShow.addClass('hide');
                        lessShow.removeClass('show');
                    }
                };
                $scope.active_id = appointment_settings_id;
                $scope.ViewSlot = 1;
                $scope.userLoadMore = 5;
                var slot_index = 0;
                var time_slot_set_id = 0;
                if (angular.isDefined(appointment_settings_id) && appointment_settings_id !== null) {
                    params = {};
                    params.apt_set_id =  appointment_settings_id;
                    params.view_slot_week = $scope.ViewSlot;
                    $scope.loader = true;
                    AppointmentWeekList.get(params).$promise.then(function (response) {
                        $scope.appointment_timeslots.push({
                            days: daysAddIntially(),
                            slotIndex: slot_index,
                            viewslot: response.viewslot,
                            appointmentLoadMore: $scope.userLoadMore,
                            timeslots: response.data,
                            show_button: response.data.show_button,
                            apt_set_id:appointment_settings_id,
                            branch_id:branch_id,
                            doctor_user_id: doctor_user_id
                        });
                        angular.forEach($scope.appointment_timeslots, function(timeslot,value) {
                            if(timeslot.apt_set_id === appointment_settings_id){
                                time_slot_set_id = value;
                            }
                        });
                        $timeout(function() {
                            $scope.loader = false;
                            $scope.appointmentlists = $scope.appointment_timeslots[time_slot_set_id];
                        }, 500);  
                    });
                }   
        }; 
        $scope.dateAddFunction = function(days, multipleCount) {
            var dateValue = {};
            $scope.positions = [];
            /* $scope.dateAddFunction = function (days, multipleCount) {*/
            if (parseInt(multipleCount) > 1) {
                $scope.addDays = (parseInt(multipleCount) - 1) * 7 + parseInt(days);
            } else {
                $scope.addDays = parseInt(days);
            }
            var displayDate = '',
            monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            if ((parseInt(days) ==='0') && (parseInt(multipleCount) === '1')) {
                displayDate = new Date();
                dateValue = {
                    day: $filter('date')(displayDate, "EEE"),
                    date: $filter('fullDate')(displayDate.getDate()+"-"+monthShortNames[parseInt(displayDate.getMonth())]+"-"+displayDate.getFullYear()),
                    dayE: moment(displayDate).format('ddd')
                };
                return dateValue;
            } else if ((parseInt(days) === '0') && (parseInt(multipleCount) > 1)) {
                days = (parseInt(multipleCount) - 1) * 7;
                displayDate = addDays(new Date(), days);
                dateValue = {
                    day: $filter('date')(displayDate, "EEE"),
                    date: $filter('fullDate')(displayDate.getDate()+"-"+monthShortNames[parseInt(displayDate.getMonth())]+"-"+displayDate.getFullYear()),
                    dayE: moment(new Date()).add(days, 'days').format('ddd')                  
                };
                return dateValue;
            } else {
                displayDate = addDays(new Date(), $scope.addDays);
                dateValue = {
                    day: $filter('date')(displayDate, "EEE"),
                    date: $filter('fullDate')(displayDate.getDate()+"-"+monthShortNames[parseInt(displayDate.getMonth())]+"-"+displayDate.getFullYear()),
                    dayE: moment(new Date()).add($scope.addDays, 'days').format('ddd')
                };
                return dateValue;
            }
        };
        $scope.init();
        function addDays(theDate, days) {
            return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
        }
        $scope.nextWeek = function (value, slot_index) {
            slot_index = 0;
            $scope.appointment_timeslots[slot_index].viewslot = parseInt($scope.appointment_timeslots[slot_index].viewslot) + 1;
            params = {};
            params.apt_set_id =  value;
            params.view_slot_week = $scope.appointment_timeslots[slot_index].viewslot;
            AppointmentWeekList.get(params).$promise.then(function (response) {
                $scope.appointment_timeslots[slot_index].timeslots =  response.data;
                $scope.appointment_timeslots[slot_index].days = daysAdd(slot_index);
                $scope.appointment_timeslots[slot_index].viewslot = response.viewslot;
                $scope.appointment_timeslots[slot_index].show_button = response.data.show_button;
            });
        };
        $scope.prevWeek = function (value, slot_index) {
            slot_index = 0;
            if ($scope.appointment_timeslots[slot_index].viewslot === '1') {
                $scope.appointment_timeslots[slot_index].viewslot = 1;
            } else {
                $scope.appointment_timeslots[slot_index].viewslot = parseInt($scope.appointment_timeslots[slot_index].viewslot) - 1;
                params = {};
                params.apt_set_id =  value;
                params.view_slot_week = $scope.appointment_timeslots[slot_index].viewslot;
                AppointmentWeekList.get(params).$promise.then(function (response) {
                    $scope.appointment_timeslots[slot_index].timeslots = response.data;
                    $scope.appointment_timeslots[slot_index].days = daysAdd(slot_index);
                    $scope.appointment_timeslots[slot_index].viewslot = response.viewslot;
                    $scope.appointment_timeslots[slot_index].show_button = response.data.show_button;
                });
            }
        };
       
        $scope.isAuthenticated = function () {
            return $auth.isAuthenticated();
        };


        /* Get all branches function*/
        $scope.GetAllDoctors = function() {
            var Where = [];
            var api_filter = {};
            Where.push({
                "where": {},
                "include": {}
            });
            api_filter.clinic_user_id =  $rootScope.auth.id;
            Where[0].include[0] = 'user.user_profile';
            Where[0].include[1] = 'user.attachment';
            Where[0].include[2] = 'branch';
            Where[0].include[3] = 'branch.city';
            Where[0].include[4] = 'appointment_settings';
            Where[0].include[5] = 'user.primary_speciality';
            Where[0].where = api_filter;
            params.filter = JSON.stringify(Where[0]);
            params.is_slot_need = 1;
            params.view_slot_week= 1;
            DoctorsFactory.get(params, function(response) {
                $scope.doctors = response.data;
                $scope.dataLength = (response.data.length > 0) ? true : false;
                angular.forEach($scope.doctors, function(doctoruser,key) {
                    var provider_user = doctoruser;
                    provider_user.user.user_image = (provider_user.user.user_profile.gender_id === ConstGenders.Female) ? 'images/femaledoctor.jpg' : 'images/maledoctor.jpg'; 
                    if (angular.isDefined(provider_user.user.attachment) && provider_user.user.attachment !== null) {
                        provider_user.user.user_image = 'images/medium_thumb/UserAvatar/' + provider_user.user.attachment.id + '.' + md5.createHash('UserAvatar' + provider_user.user.attachment.id + 'png' + 'medium_thumb') + '.png';
                    }
                    $scope.doctors[key].user.user_image = provider_user.user.user_image;
                });    
                if ($scope.doctors.length > 0) {
                    $scope.GetAppointmentSlots($scope.doctors[0].appointment_settings.id, $scope.doctors[0].branch_id, $scope.doctors[0].user_id);
                }
            });
        };
        $scope.GetAllDoctors();

        //Appointment Popup
       $scope.ClinicbookNow = function(branch_id,doctor_user_id,apt_date,apt_time) {
            $scope.modalInstance = $uibModal.open({
                templateUrl: 'scripts/plugins/Clinic/Clinic/views/default/appointment_booking.html',
                animation: true,
                controller: function($scope, $rootScope, $window, $stateParams, $filter, md5, $state, $timeout, $uibModal, $uibModalStack, AppointmentTypes) {
                    $rootScope.closemodel = function() {
                        $uibModalStack.dismissAll();
                    };
                    var params = {};
                    $scope.data = {};
                    $scope.branch_id = branch_id;
                    $scope.doctor_user_id = doctor_user_id;
                    $scope.apt_date = apt_date;
                    $scope.apt_time = apt_time;
                    //Select Gender List
                    /* $scope.appointmentTypes = [];
                    $scope.appointmentTypes.push(
                        {'id': 2, "name": $filter("translate")('Phone')},
                        {'id': 3, "name": $filter("translate")('Walk-in')}
                    ); */
                    params = {};
                    params.filter = '{"where":{"is_active": 1},"order":"name asc","limit":"all","skip":0}';
                    AppointmentTypes.get(params, function (response) {
                        $scope.appointmentTypes = response.data;
                    });
                    params = {};
                    params.filter = '{"where":{"user_id":'+ doctor_user_id +', "branch_id":'+ branch_id +'},"include":{"0":"branch","1":"user","2":"user.user_profile","3":"user.attachment","4":"branch.city","7":"branch.country","8":"user.primary_speciality"}}';
                    BookingAppointmentDetails.get(params, function(response) {
                        $scope.doctor = response.data[0];
                        $scope.doctor.user.user_image = 'images/maledoctor.jpg';
                        if (angular.isDefined($scope.doctor.user.attachment) && $scope.doctor.user.attachment !== null) {
                            $scope.doctor.user.user_image = 'images/big_thumb/UserAvatar/' + $scope.doctor.user.attachment.id + '.' + md5.createHash('UserAvatar' + $scope.doctor.user.attachment.id + 'png' + 'big_thumb') + '.png';
                        }
                    });
                    $scope.AptBookNow = function(appointment) {
                        var appointmentData = {};
                        appointmentData.provider_user_id = $scope.doctor_user_id;
                        appointmentData.branch_id = $scope.branch_id;
                        appointmentData.appointment_date = $filter('date')(new Date($scope.apt_date),'yyyy-MM-dd');
                        appointmentData.appointment_time = $scope.apt_time;
                        appointmentData.appointment_type_id = appointment.appointment_type_id;
                        appointmentData.first_name = appointment.first_name;
                        appointmentData.last_name = appointment.last_name;
                        appointmentData.email = appointment.email;
                        appointmentData.phone = appointment.phone;
                        appointmentData.appointment_status_id = 2;
                        appointmentData.country_id = "102";// localStorage.getItem('SelectedCountryId');
                        ClinicAppointmentBookingAdd.post(appointmentData, function (response) {
                            $scope.closemodel();
                            var flashMessage;
                            if (parseInt(response.error.code) === 0) {
                                    $state.reload();
                                    flashMessage = $filter("translate")("Appointment added successfully with date")+ " "+ response.data.appointment_date + $filter("translate")(" and time ") + response.data.appointment_time;
                                    flash.set(flashMessage, 'success', true);
                            } else {
                                $scope.save_btn = false;
                                flashMessage = $filter("translate")("Appointment added failed.");
                                flash.set(flashMessage, 'error', false);
                            }
                        }, function (error) {
                            $scope.mobileErr = error.data.error.raw_message.mobile;
                            flash.set($filter("translate")(error.data.error.raw_message.mobile), 'error', false);
                           // console.log('Appointment Error', error);
                        });
                    };
                    $scope.already_added = false;
                    $scope.searchPatient = function (mobile_number) {
                        if (mobile_number !== '' && mobile_number !== undefined) {
                            $scope.data.phone = mobile_number;
                            params.filter = '{"where":{"mobile": "'+$scope.data.phone+'"}}';
                            SearchPatients.get(params, function(response) {
                                    $scope.patients = response.data;
                                    $scope.already_added = (response.data.length > 0) ? true : false;
                                    $scope.addPatients = (response.data.length > 0) ? false : true;
                                    $scope.showPatients = true;
                            });
                        }
                     };
                },
                size: 'lg'
            });
        };
    });