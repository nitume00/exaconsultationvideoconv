'use strict';
/**
 * @ngdoc function
 * @name abs.controller:BranchesController
 * @description
 * # BranchesController
 * Controller of the abs
 */
angular.module('abs')

.controller('ChooseTestsController', function($state, $rootScope, $scope, $filter, $location, $timeout, flash, DiagnosticCenterTestsFactory, SweetAlert, RemoveTest, DiagnosticCenterTestsEdit, BranchesTimeSlot, md5, LabTestsGetFactory, FamilyFriends, FamilyFriendsEdit, UserViewProfileFactory, DiagnosticBookingAdd, ConstUserType, ConstAppointmentStatus, AppointmentTypes){
    $scope.totalcost = 0;  
    $scope.index = function () {
        $rootScope.pageTitle = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("Choose Lab Tests");
        $scope.branch_id = $state.params.branch_id;
        $scope.labtest_id = $state.params.labtest_id;
        $scope.addedTests = {};
        $scope.Tests = {};
        $scope.labtestmark = {};
        $scope.dateBlockeBefore = $filter('date')(new Date(), "yyyy-MM-ddTHH:mm:ss.sssZ");
        $scope.ConstUserType = ConstUserType;
        $scope.ConstAppointmentStatus = ConstAppointmentStatus;
    };
    var count = 0;
    $scope.index();
     /* [ GET - branch by Id ] */  
     function getBranchById(id){
            var params = {};
            $scope.images = [];
            params.id = id;
            params.filter = '{"include":{"0":"attachment","1":"city","2":"country"}}';
            BranchesTimeSlot.get(params).$promise.then(function (response) {
                $scope.branch = response.data;
                if (angular.isDefined(response.data.attachment) && Object.keys(response.data.attachment)
                    .length > 0) {
                    angular.forEach(response.data.attachment, function (value, key) {
                            var small_hash = md5.createHash(value.class + value.id + 'png' + 'small_thumb');
                            var small_thumb= 'images/small_thumb/' + value.class + '/' + value.id + '.' + small_hash + '.png';
                            var medium_hash = md5.createHash(value.class + value.id + 'png' + 'medium_thumb');
                            var medium_thumb= 'images/medium_thumb/' + value.class + '/' + value.id + '.' + medium_hash + '.png';
                            $scope.images.push({
                                thumb: small_thumb,
                                img: medium_thumb
                            });
                        });
                    }     
                 $scope.branchImages = $scope.images;                         
            });
     }
     /* [ GET - branch by Id ] */  
     function getLabTestById(id){
            var params = {};
            params.id = id;
            params.filter = '{"where":{"diagnostic_center_user_id":' + $state.params.diagnostic_center_user_id + ', "branch_id":'+ $scope.branch_id +', "lab_test_id":'+ $scope.labtest_id +'},"include":{"0":"diagonostic_test_image","1":"lab_test"}}';
            DiagnosticCenterTestsFactory.get(params).$promise.then(function (response) {
                $scope.sellabtest = response.data;
            });
     }    
     /* [ GET - diagnostic_center by Id ] */  
     function getDiagnosticById(id){
            var params = {};
            params.id = id;
            params.filter = '{"where":{"diagnostic_center_user_id":' + $state.params.diagnostic_center_user_id + ', "branch_id":'+ $scope.branch_id +', "lab_test_id":'+ $scope.labtest_id +'},"include":{"0":"diagonostic_test_image","1":"user.user_profile"}}';
            DiagnosticCenterTestsFactory.get(params).$promise.then(function (response) {
                $scope.diagonostic = response.data[0];
            });
     }    
     getBranchById($scope.branch_id);
     getDiagnosticById($scope.branch_id);
    // getLabTestById($scope.labtest_id);   
     var params = {};       
   /**
     * @ngdoc method
     * @name BranchesController.branch
     * @methodOf module.BranchesController
     * @description
     * This method is used to get the clinic branches listing
    */
    $scope.loader=true;
    $scope.mybranchlabtests = function() {
        var params = {};
        params.filter = '{"where":{"diagnostic_center_user_id":' + $state.params.diagnostic_center_user_id + ', "branch_id":'+ $scope.branch_id +'},"include":{"0":"diagonostic_test_image","1":"lab_test"}}';
        $scope.loader = true;
        if($state.params.page === undefined) {
            params.page = 1;
        } else {
            params.page = $state.params.page;
        }  
        DiagnosticCenterTestsFactory.get(params, function(response) {
            if (angular.isDefined(response._metadata)) {
                $scope.currentPage = response._metadata.current_page;
                $scope.totalItems = response._metadata.total;
                $scope.itemsPerPage = response._metadata.per_page;
                $scope.noOfPages = response._metadata.last_page;
            }
            if (angular.isDefined(response.data)) {
                $scope.labtests = response.data;
                $scope.dataLength = (response.data.length > 0) ? true : false;
            }
            $scope.booking_type = 'me'; 
            $scope.radioSelected= function (value) {
                $scope.booking_type= value;
                $scope.checkFamily = false;
            };
            params = {};
            params.id = $rootScope.auth.id;
            params.filter = '{"include":{"1":"user_profile"}}';
            UserViewProfileFactory.get(params, function(response) {
                $scope.patient = response.data;
            });
            params = {};
            params.filter = '{"where":{"user_id":'+$rootScope.auth.id +'}}';
            FamilyFriends.get(params, function(response) {
                $scope.family_friends = response.data;
                $scope.familyLength = (response.data.length > 0) ? true : false;
            });
            $scope.changeFamilyList = function(id) {
                params = {};
                params.id = id;
                $scope.checkFamily = false;
                FamilyFriendsEdit.get(params, function(response) {
                    $scope.familydata = response.data;
                    $scope.checkFamily = true;
                });    
            };
            var checkedKey = '';
            angular.forEach($scope.labtests, function(lab, key) {
                    if (lab.diagonostic_test_image !== null) {
                        lab.lab_image = 'images/big_thumb/DiagonosticTest/' + lab.diagonostic_test_image.id + '.' + md5.createHash('DiagonosticTest' + lab.diagonostic_test_image.id + 'png' + 'big_thumb') + '.png';
                    } else {
                        lab.lab_image = 'images/diagnostic_image.jpg';
                    }
                    $scope.labtests[key].checked = false; 
                    if(parseInt($scope.labtest_id) === parseInt(lab.lab_test.id)) {
                        var labtests = {};
                        labtests.id = lab.id;
                        labtests.price = lab.price;
                        labtests.lab_id = lab.lab_test.id;
                        labtests.lab_test_name = lab.lab_test.name;
                        $scope.addedTests[count] = {};
                        $scope.addedTests[count].id = lab.lab_test.id;
                        $scope.addedTests[count].lab_test_name = lab.lab_test.name;
                        $scope.addedTests[count].price = lab.price;
                        $scope.addedTests[count].lab_image = $scope.labtests[key].lab_image;
                        $scope.addedTests[count].data = labtests;
                        $scope.totalcost = $scope.totalcost + lab.price;
                        checkedKey = key;
                    }
                });
                $scope.labtests.splice(checkedKey,1);
                $scope.loader=false;
        });
    };
    $scope.mybranchlabtests();
        /**
         * @ngdoc method
         * @name ChooseSeatController.addItemsToCart
         * @methodOf module.ChooseSeatController
         * @description
         * This method will add items to addedTests object
         * @param {object,string, string,string} 
         */
        $scope.addLabTestToCart = function($event, diagnostic_center_test_id, lab_id, lab_test_name, price) {
            var isExist = false;
            var labtests = {};
            if($scope.labtestmark[lab_id]) {
                angular.forEach($scope.addedTests, function(lab, key) {
                    if(parseInt(lab.id) !== parseInt(lab_id)) {
                        isExist = true;
                    }
                });
                if(isExist) {
                    count = count + 1;
                    labtests.id = diagnostic_center_test_id;
                    labtests.price = price;
                    labtests.lab_id = lab_id;
                    labtests.lab_test_name = lab_test_name;
                    $scope.Tests[count] = {};
                    $scope.addedTests[count] = {};
                    $scope.addedTests[count].id = lab_id;
                    $scope.addedTests[count].lab_test_name = lab_test_name;
                    $scope.addedTests[count].price = labtests.price;
                    $scope.addedTests[count].data = labtests;
                    $scope.totalcost = $scope.totalcost + price;
                    count++;
                }            
            } else if(!$scope.labtestmark[lab_id]){
                angular.forEach($scope.addedTests, function(lab, key) {
                    if(lab.id === lab_id) {
                        $scope.totalcost = $scope.totalcost - price;
                        $('#labtest_row_' + key).remove();
                        delete $scope.addedTests[key];
                    }    
                });     
            }
        };

        /**
         * @ngdoc method
         * @name ChooseTestsController.removeAddedTest
         * @methodOf module.ChooseTestsController
         * @description
         * This method will remove single test to addedTests object
         * @param {string ,number, string} 
         */
        $scope.removeAddedTest = function(event, index, price) {
            $scope.totalcost = $scope.totalcost - price;
            $('#labtest_row_' + index)
                .remove();
            $scope.labtestmark[$scope.addedTests[index].id] = false    
            delete $scope.addedTests[index];
        };
        $scope.guestName = function(gtname)
        {
            $scope.guest_name = gtname;
        };
          /*  $scope.appointmentTypes = [];
             $scope.appointmentTypes.push(
                {id: 2, "name": $filter("translate")('Phone')},
                {id: 3, "name": $filter("translate")('Walk-in')},
                {id: 4, "name": $filter("translate")('Home care')}
            ); */
            params = {};
            params.filter = '{"where":{"is_active": 1},"order":"name asc","limit":"all","skip":0}';
            AppointmentTypes.get(params, function (response) {
                $scope.appointmentTypes = response.data;
            });
            $scope.data = {};
            $scope.data.appointment_type_id = 2;
            $scope.UserDetails = function(details)
            {
                $scope.data = details;
            };
        $scope.BookNow = function ($valid, form, type){
            if($scope.booking_type !== "me") {
                if($scope.guest_name === undefined) { 
                    $scope.guest_name_required = true;
                }
            }
            if ($valid) {
                $scope.disableButton = true;
                var bookingData = {};
                bookingData.patient_id = $rootScope.auth.id;
                bookingData.diagnostic_center_user_id = $state.params.diagnostic_center_user_id;
                bookingData.branch_id = $state.params.branch_id;
                bookingData.appointment_date = $filter('date')(new Date(form.appointment_date.$modelValue),'yyyy-MM-dd');
                bookingData.appointment_time = form.appointment_time.$modelValue;
                bookingData.appointment_type_id = 1;
                if(parseInt($rootScope.user.role_id) === parseInt($scope.ConstUserType.Diagnostic)) {
                    bookingData.first_name = $scope.data.first_name;
                    bookingData.last_name = $scope.data.last_name;
                    bookingData.phone = $scope.data.phone;
                    bookingData.email = $scope.data.email;
                    bookingData.appointment_type_id = $scope.data.appointment_type_id;
                }
                if(parseInt($rootScope.user.role_id) === parseInt($scope.ConstUserType.User)) {
                    if($scope.booking_type === "me") {
                        bookingData.user_id = $rootScope.user.id;
                    } else {
                        bookingData.guest_name = $scope.guest_name;
                    }
                }
                $scope.diagnostic_center_tests = [];
                angular.forEach($scope.addedTests, function (value) {
                    $scope.diagnostic_center_tests.push({
                        diagnostic_center_test_id: value.data.id,
                        diagnostic_center_lab_test_id: value.id
                    });
                });
                bookingData.diagnostic_center_tests = $scope.diagnostic_center_tests; 
                if($scope.booking_type=== 'some_one_else') {
                    bookingData.family_friend_id = $scope.family_friend_id;
                }
                /*if(type === 'pay-now') {
                    bookingData.appointment_status_id = $scope.ConstAppointmentStatus.PaymentPending; 
                } else {
                    bookingData.appointment_status_id = $scope.ConstAppointmentStatus.Approved;
                }*/
                bookingData.appointment_status_id = $scope.ConstAppointmentStatus.Approved;
                DiagnosticBookingAdd.post(bookingData, function (response) {
                    var flashMessage;
                    if (parseInt(response.error.code) === 0) {
                        if(type === 'pay-now') {
                            flashMessage = $filter("translate")("Appointment added successfully with date")+ " "+ response.data.appointment_date + $filter("translate")(" and time ") + response.data.appointment_time + '. ' + $filter("translate")('Please complete your payment.');
                            flash.set(flashMessage, 'success', false);
                            $state.go('diagnostic_payment', {'id': response.data.id});
                        } else {
                            flashMessage = $filter("translate")("Appointment added successfully with date")+ " "+ response.data.appointment_date + $filter("translate")(" and time ") + response.data.appointment_time;
                            flash.set(flashMessage, 'success', false);
                            $state.go('diagnostic_branch_view',{id: $scope.branch.id,slug:$scope.branch.name});
                        }    
                    } else {
                        $scope.save_btn = false;
                        flashMessage = $filter("translate")("Appointment added failed.");
                        flash.set(flashMessage, 'error', false);
                    }
                }, function (error) {
                    console.log('Appointment Error', error);
                });
            }  
    } 
});   