'use strict';
angular.module('abs')
    .directive('appointmentBooking', function () {
        return {
            restrict: 'E',
            scope: true,
            templateUrl: 'views/appointment_booking_button.html',
            controller: function ($window, $rootScope, $state, $location, $scope, Slug, Countries, CountriesCity, $timeout, $uibModal, $uibModalStack, UserViewProfileFactory, ConstAppointmentStatus) {
                $rootScope.appointmentNow = function (branch_id, doctor_user_id, app_date, app_time) {
                    $rootScope.branch_id = branch_id;
                    $rootScope.doctor_id = doctor_user_id;
                    $rootScope.app_date = app_date;
                    $rootScope.app_time = app_time;
                    $scope.modalInstance = $uibModal.open({
                        templateUrl: 'views/book_now.html',
                        animation: true,
                        controller: function ($scope, $rootScope, $window, $stateParams, $filter, md5, $state, $timeout, $uibModal, $uibModalStack, BookingAppointmentDetails, $cookies, Country, usersLogin, flash, AppointmentBookingAdd, usersRegister, OtpVerify, OtpResend, ConstUserType, Specialties, Genders) {
                              $scope.loader = true;
                                $timeout(function () {
                                    $scope.loader = false;
                                },2000);
                            $scope.data = {};
                            function getDayClass(data) {
                                var date = data.date,
                                    mode = data.mode;
                                if (mode === 'day') {
                                    var dayToCheck = new Date(date)
                                        .setHours(0, 0, 0, 0);
                                    for (var i = 0; i < $scope.events.length; i++) {
                                        var currentDay = new Date($scope.events[i].date)
                                            .setHours(0, 0, 0, 0);
                                        if (dayToCheck === currentDay) {
                                            return $scope.events[i].status;
                                        }
                                    }
                                }
                                return '';
                            }
                            /*  date picker start*/
                            /*  today date */
                            $scope.today = function () {
                                $scope.dt = new Date();
                            };
                            $scope.today();
                            $scope.clear = function () {
                                $scope.dt = null;
                            };
                            $scope.inlineOptions = {
                                customClass: getDayClass,
                                minDate: new Date(),
                                showWeeks: true
                            };
                            $scope.dateOptions = {
                                formatYear: 'yy',
                                maxDate: new Date(2020, 12, 31),
                                minDate: new Date(),
                                startingDay: 1
                            };

                            function toggleMin() {
                                $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
                                $scope.dateOptions.minDate = new Date();
                            }
                            toggleMin();
                            $scope.open1 = function () {
                                $scope.popup1.opened = true;
                            };
                            $scope.open2 = function () {
                                $scope.popup2.opened = true;
                            };
                            $timeout(function () {
                                var currentDate = {};
                                if($rootScope.app_date !== undefined)
                                {
                                    currentDate = $rootScope.app_date;
                                }else{
                                    currentDate = new Date();
                                }
                                $scope.setDate(currentDate);
                                $scope.data.is_guest_appointment = '0';
                            }, 1000);

                            $scope.setDate = function (date) {
                                      $scope.data.appointment_date = new Date(date);
                            };
                            $scope.formats = ['yyyy-MM-dd', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
                            $scope.format = $scope.formats[1];
                            $scope.altInputFormats = $scope.formats[1];
                            $scope.popup1 = {
                                opened: false
                            };
                            $scope.popup2 = {
                                opened: false
                            };

                            /*  date picker End*/

                            $scope.BookingDate = function (bookingdate) {
                                $scope.bookingSlots = [];
                                var userparams = {};
                                userparams.filter = '{"where":{"id":' + $rootScope.doctor_id + '}}';
                                userparams.is_slot_need = 1;
                                userparams.date = $filter('date')(new Date(bookingdate), 'yyyy-MM-dd');
                                UserViewProfileFactory.get(userparams, function (response) {
                                    $scope.slots = response.data[0].slot;
                                    angular.forEach($scope.slots, function (keys) {
                                        angular.forEach(keys, function (key) {
                                            $scope.bookingSlots.push({ 'booking_time': key });
                                        });
                                    });
                                });
                            };
                            $timeout(function () {
                                     $scope.BookingDate($scope.data.appointment_date);
                            }, 1500);

                            $rootScope.closemodel = function () {
                                $uibModalStack.dismissAll();
                            };

                            $scope.data = {};
                            $scope.branch_id = branch_id;
                            $scope.doctor_user_id = doctor_user_id;
                            $scope.data.booking_type = 'me';
                            if ($scope.data.appointment_time === null || $scope.data.appointment_time === undefined || $scope.data.appointment_time === '') {
                                $timeout(function () {
                                    if($rootScope.app_time !== undefined)
                                    {
                                         $scope.data.appointment_time = $rootScope.app_time;
                                    }else{
                                         $scope.data.appointment_time = $scope.bookingSlots["0"].booking_time;
                                    }
                                }, 1800);
                            }
                            $scope.radioSelected = function (value) {
                                $scope.data.booking_type = value;
                                $scope.checkFamily = false;
                            };
                            var params = {};
                            /* params.id = $rootScope.auth.id;
                             params.filter = '{"include":{"1":"user_profile"}}';
                             UserViewProfileFactory.get(params, function(response) {
                                 $scope.patient = response.data;
                             });*/
                            /*params.filter = '{"where":{"user_id":' + $rootScope.auth.id + '}}';*/

                            params.filter = '{"where":{"user_id":' + doctor_user_id + ', "branch_id":' + branch_id + '},"include":{"0":"branch","1":"user","2":"user.user_profile","3":"user.attachment","4":"branch.city","7":"branch.country","8":"user.primary_speciality"}}';
                            BookingAppointmentDetails.get(params, function (response) {
                                $scope.doctor = response.data[0];
                                $scope.doctor.user.user_image = 'images/maledoctor.jpg';
                                if (angular.isDefined($scope.doctor.user.attachment) && $scope.doctor.user.attachment !== null) {
                                    $scope.doctor.user.user_image = 'images/big_thumb/UserAvatar/' + $scope.doctor.user.attachment.id + '.' + md5.createHash('UserAvatar' + $scope.doctor.user.attachment.id + 'png' + 'big_thumb') + '.png';
                                }
                            });
                            $scope.AppointmentChange = function () {
                                $scope.form1 = true;
                                $scope.form2 = false;
                            };
                            $scope.form1 = true;
                            $scope.BookNow = function ($valid) {
                                if($valid === true)
                                {
                                    $cookies.put('user_appointment_details', JSON.stringify($scope.data));
                                    $scope.form2 = true;
                                    $scope.form1 = false;
                                }
                            };
                            $scope.DetailsConformed = function () {
                                if ($rootScope.isAuth === false) {
                                    $scope.form1 = false;
                                    $scope.form2 = false;
                                    $scope.loginform = true;
                                } else {
                                    if ($scope.data) {
                                        var appointmentData = {};
                                        appointmentData.user_id = $rootScope.auth.id;
                                        appointmentData.provider_user_id = $scope.doctor_user_id;
                                        appointmentData.branch_id = $scope.branch_id;
                                        appointmentData.appointment_date = $filter('date')(new Date($scope.data.appointment_date), 'yyyy-MM-dd');
                                        appointmentData.appointment_time = $scope.data.appointment_time;
                                        appointmentData.appointment_type_id = 1;
                                        appointmentData.appointment_status_id = 2;
                                        appointmentData.booking_type = $scope.data.booking_type;
                                        appointmentData.customer_note = $scope.data.customer_note;
                                        appointmentData.is_guest_appointment = $scope.data.appointment;
                                        appointmentData.guest_name = $scope.data.guest_name;
                                        AppointmentBookingAdd.post(appointmentData, function (response) {
                                            if (parseInt(response.error.code) === 0) {
                                                $uibModalStack.dismissAll(); 
                                                if(response.data.appointment_status_id == ConstAppointmentStatus.PaymentPending) {
                                                    flash.set($filter("translate")("Please complete the payment."), 'success', false);
                                                    $state.go('AppointmentPayment', {'id': response.data.id});
                                                } else {
                                                    flash.set($filter("translate")("Appointment added successfully with date"+ " "+ response.data.appointment_date + " and time " + response.data.appointment_time), 'success', false);
                                                    $state.go('MyAppointments');
                                                }
                                                
                                            } else {
                                                $scope.save_btn = false;
                                                flash.set($filter("translate")("Appointment added failed."), 'error', false);
                                            }
                                        }, function (error) {
                                            console.log('Appointment Error', error);
                                        });
                                    }
                                }
                            };

                            /*  login */
                            $scope.login = {};
                        
                            params.filter = '{"order":"name asc","limit":500,"skip":0}';
                            Country.get(params, function (response) {
                                $scope.country_codes = response.data;
                            });
                            $scope.userChoose = 'mobile';
                            $scope.userVia = true;
                            $scope.loginVia = function () {
                                $scope.userVia = true;
                                if ($scope.userChoose === 'mobile') {
                                    Country.get(params, function (response) {
                                        $scope.country_codes = response.data;
                                    });
                                } else {
                                    $scope.userVia = false;
                                    $scope.userChoose = 'email';
                                }
                            };
                            $scope.credentials = {};
                            $scope.mobile = {};
                            $scope.login = function (isvalid, $event) {
                                if (isvalid) {
                                    if ($scope.userChoose === 'mobile') {

                                        $scope.credentials.mobile_code = "+" + $scope.mobile.mobile_code;
                                    }
                                    usersLogin.login($scope.credentials).$promise.then(function (response) {
                                            $scope.user = {};
                                            $rootScope.auth = response;
                                            $scope.response = response;
                                            delete $scope.response.scope;
                                            $scope.user.id = response.id;
                                            $scope.user.role_id = parseInt(response.role_id);
                                            $scope.user.email = response.email;
                                            $scope.user.reference_code = response.reference_code;
                                            $scope.user.refresh_token = response.token;
                                            $scope.user.attachment = response.attachment;
                                            $scope.user.is_otp_verify = response.is_otp_verify;
                                            $scope.user.display_name = response.user_profile.display_name;
                                            $scope.user.user_profile = response.user_profile;
                                            // If login is successful, redirect to the home page
                                            if ($scope.response.error.code === 0) {
                                                $cookies.put('auth', angular.toJson($scope.user), {
                                                    path: '/'
                                                });
                                                $cookies.put('token', response.token, {
                                                    path: '/'
                                                });
                                                if ($cookies.get("auth") !== null && $cookies.get("auth") !== undefined) {
                                                    $rootScope.isAuth = true;
                                                    $rootScope.auth = JSON.parse($cookies.get("auth"));
                                                    if (angular.isDefined($rootScope.auth.attachment) && $rootScope.auth.attachment !== null) {
                                                        var hash = md5.createHash($rootScope.auth.attachment.class + $rootScope.auth.attachment.id + 'png' + 'small_thumb');
                                                        $rootScope.auth.userimage = 'images/small_thumb/' + $rootScope.auth.attachment.class + '/' + $rootScope.auth.attachment.id + '.' + hash + '.png';
                                                    } else {
                                                        $rootScope.auth.userimage = $window.theme + 'images/default.png';
                                                    }
                                                }
                                                flash.set($filter("translate")("Login successfully."), 'success', false);
                                                if ($scope.data) {
                                                    var appointmentData = {};
                                                    appointmentData.user_id = $rootScope.auth.id;
                                                    appointmentData.provider_user_id = $scope.doctor_user_id;
                                                    appointmentData.branch_id = $scope.branch_id;
                                                    appointmentData.appointment_date = $filter('date')(new Date($scope.data.appointment_date), 'yyyy-MM-dd');
                                                    appointmentData.appointment_time = $scope.data.appointment_time;
                                                    appointmentData.appointment_type_id = 1;
                                                    appointmentData.appointment_status_id = 2;
                                                    appointmentData.booking_type = $scope.data.booking_type;
                                                    appointmentData.customer_note = $scope.data.customer_note;
                                                    appointmentData.is_guest_appointment = $scope.data.appointment;
                                                    /*  if (appointment.booking_type === 'me') {
                                                          appointmentData.family_friend_id = appointment.family_friend_id;
                                                      }*/

                                                    AppointmentBookingAdd.post(appointmentData, function (response) {
                                                        if (parseInt(response.error.code) === 0) {
                                                            flash.set($filter("translate")("Appointment added successfully."), 'success', false);
                                                            $state.go('MyAppointments');
                                                        } else {
                                                            $scope.save_btn = false;
                                                            flash.set($filter("translate")("Appointment added failed."), 'error', false);
                                                        }
                                                    }, function (error) {
                                                        console.log('Appointment Error', error);
                                                    });
                                                }
                                                $uibModalStack.dismissAll();
                                            } else {
                                                flash.set($filter("translate")("Sorry, login failed. Either your username or password are incorrect or admin deactivated your account."), 'error', false);
                                            }
                                    }, //jshint unused:false 
                                        function (error) {
                                            flash.set($filter("translate")("Sorry, login failed. Either your username or password are incorrect or admin deactivated your account."), 'error', false);
                                            $uibModalStack.dismissAll();
                                        });
                                }
                            };

                            /*register*/


                            $scope.ConstUserType = ConstUserType;
                            $rootScope.user_type = $state.params.user_type;
                            $scope.user = {};
                            
                            $scope.userType = function (userType) {
                                $state.go('register', {
                                    'user_type': userType
                                }, { reload: true });
                            };
                            params.filter = '{"order":"name asc","limit":500,"skip":0}';
                            Country.get(params).$promise.then(function (response) {
                                $rootScope.countries = response.data;
                            });
                            Specialties.get(params).$promise.then(function (response) {
                                $scope.specialties = response.data;
                            });
                            Genders.get({}).$promise.then(function (response) {
                                $scope.genders = response.data;
                            });
                            /*  $scope.placeholder_name = $state.params.user_type + " " + 'Name';*/
                            $scope.signup = function (isvalid) {
                                if (isvalid && $scope.user.password === $scope.user.confirm_password) {
                                    $scope.user.role_id = parseInt($scope.ConstUserType.User);
                                    var credentials = {
                                        first_name: $scope.user.first_name,
                                        last_name: $scope.user.last_name,
                                        display_name: $scope.user.display_name,
                                        email: $scope.user.email,
                                        password: $scope.user.password,
                                        confirm_password: $scope.user.confirm_password,
                                        mobile: $scope.user.mobile,
                                        mobile_code: $scope.user.mobile_code,
                                        gender_id: $scope.user.gender_id,
                                        country: $scope.user.country,
                                        is_agree_terms_conditions: $scope.user.terms_conditions,
                                        role_id: parseInt($scope.user.role_id),
                                        primary_speciality_id: $scope.user.primary_speciality_id,
                                        reference_code: $scope.user.reference_code
                                    };
                                    usersRegister.create(credentials, function (response) {
                                        if (response.error.code === 0) {
                                            $scope.regiter_id = response.id;
                                            $scope.otpForm = true;
                                            $scope.form1 = false;
                                            $scope.form2 = false;
                                            $scope.loginform = false;
                                        }
                                        else {
                                            flash.set($filter("translate")(response.error.message), 'error', false);
                                            console.log('error',response.error);

                                              /*if(error.data.error.fields.username && error.data.error.fields.email)
                                                {
                                                    flash.set($filter("translate")("Please choose different email and username"), 'error', false); 
                                                    $scope.save_btn = false; 
                                                }else if(error.data.error.fields.username){
                                                    flash.set($filter("translate")("Please choose different username"), 'error', false);
                                                    $scope.save_btn = false;  
                                                }else{
                                                    flash.set($filter("translate")("Please choose different email"), 'error', false);
                                                    $scope.save_btn = false; 
                                                }*/
                                        }
                                    }, function (error) {
                                        if (angular.isDefined(error.data.error.fields) && angular.isDefined(error.data.error.fields.mobile)) {
                                            flash.set($filter("translate")("Invalid mobile number and mobile code." + error.data.error.fields.mobile), 'error', false);
                                            $scope.save_btn = false;
                                        } else {
                                            flash.set($filter("translate")("User could not be added. Please, try again"), 'error', false);
                                            $scope.save_btn = false;
                                        }

                                    });

                                }
                            };
                            $scope.otp_verify = function (isValid, otpval) {
                                $scope.disableButton = true;
                                if (isValid) {
                                    var param = {};
                                    param.otp = otpval.otp;
                                    param.user_id = $scope.regiter_id;
                                    OtpVerify.post(param).$promise.then(function () {
                                        flash.set($filter("translate")("OTP Verified Successfully"), 'success', true);
                                        $scope.loginform = true;
                                        $scope.loginOnly = true;
                                        $scope.otpForm = false;
                                    }).catch(function () {
                                        flash.set($filter("translate")("Invalid OTP"), 'error', false);
                                        $scope.disableButton = false;
                                    });
                                }
                            };
                            $scope.resendotp = function () {
                                $scope.reSendButton = true;
                                OtpResend.get({ 'user_id': $scope.regiter_id }).$promise.then(function (response) {
                                    if (response.error.code === 0) {
                                        flash.set($filter("translate")(response.error.message), 'success', true);
                                    } else {
                                        flash.set($filter("translate")(response.error.message), 'error', false);
                                    }
                                }).catch(function () {
                                    flash.set($filter("translate")("Try again Later"), 'error', false);
                                    $scope.reSendButton = false;
                                });
                            };
                            $scope.getCountryPhoneCode = function (id) {
                                angular.forEach($rootScope.countries, function (country) {
                                    if (id === country.id) {
                                        $scope.country_phone_code = country.phone_code;
                                    }
                                });
                            };
                        },
                        size: 'lg'
                    });
                };
            }
        };
    });