'use strict';
/**
 * @ngdoc function
 * @name eprescriptionApp.controller:AppointmentsController
 * @description
 * # AppointmentsController
 * Controller of the eprescriptionApp
 */
angular.module('abs')
    .controller('DiagnosticLabTestsController', function ($scope, $state, $filter, $rootScope, $location, $timeout, DiagnosticLabTestsFactory, flash, ConstUserType, ConstAppointmentStatus, Slug, BranchesFactory, LabTestAppointmentView, Upload, LabTestReport, PatientBookingLogs) {
        $scope.ConstUserType = ConstUserType;
        $scope.ConstAppointmentStatus = ConstAppointmentStatus;
        $scope.maxSize = 5;
        $scope.lastPage = 1;
        $scope.itemsPerPage = 20;
        $scope.data = [];
        var params = {};
        $scope.currentPage = (angular.isDefined($state.params.page)) ? parseInt($state.params.page) : 1;
        $scope.skipvalue = $scope.itemsPerPage !== undefined ? ($scope.currentPage - 1) * $scope.itemsPerPage : 0;
        $scope.itemsPerPage = $scope.itemsPerPage !== undefined ? $scope.itemsPerPage : 0;
        /**
         * @ngdoc method
         * @name BranchesController.branch
         * @methodOf module.BranchesController
         * @description
         * This method is used to get the clinic branches listing
        */
        $scope.index = function () {
            $scope.paramsType = $state.params.type;
            if ($state.current.name === 'diagnostic_dashboard') {
                $rootScope.pageTitle = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("My Lab Tests");
                $scope.mybranches();
                $scope.branch_id = 'all';
                $scope.getPatientBookLogs();
                $scope.getLabTestList($scope.branch_id);
            } else if (($state.current.name === 'diagnostic_labtest_view')) {
                $rootScope.pageTitle = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("Lab Test Detail");
                params.id = $state.params.id;
                params.filter = '{"include":{"0":"patient.user_profile","1":"diagnostic_center_tests_patient_diagnostic_test.diagnostic_center_test.lab_test","2":"book_by_user.user_profile","3":"branch.city","4":"appointment_type","5":"appointment_status","6":"diagnostic_center_user.user_profile","7":"diagnostic_center_tests_patient_diagnostic_test.attachment"}, "limit":' + $scope.itemsPerPage + ',"skip":' + $scope.skipvalue + '}';
                LabTestAppointmentView.get(params).$promise.then(function (response) {
                    $scope.appointment = response.data;

                });
            }
        };

        /* [ GET - All Branches - Diagnostic Users] */
        $scope.mybranches = function () {
            params.filter = '{"where":{"is_active": 1,"clinic_user_id":' + $rootScope.auth.id + '}}';
            BranchesFactory.get(params, function (response) {
                if (angular.isDefined(response.data)) {
                    $scope.branches = response.data;
                    $scope.dataLength = (response.data.length > 0) ? true : false;
                }
            });
        };
        /* [ GET - Appointment List - Patient Users] */
        $scope.getLabTestList = function (id) {
            $scope.loader = true;
            $scope.branch_id = id;
            var Where = [];
            var api_filter = {};
            Where.push({
                "where": {},
                "include": {}
            });
            api_filter.diagnostic_center_user_id = $rootScope.auth.id;
            if (id !== 'all') {
                api_filter.branch_id = id;
            }
            Where[0].include[0] = 'patient.user_profile';
            Where[0].include[1] = 'branch.city';
            Where[0].include[2] = 'book_by_user.user_profile';
            Where[0].include[3] = 'appointment_type';
            Where[0].include[4] = 'appointment_status';
            Where[0].where = api_filter;
            Where[0].skip = $scope.skipvalue;
            Where[0].limit = $scope.itemsPerPage;
            params.filter = JSON.stringify(Where[0]);
            params.type = $state.params.type;
            DiagnosticLabTestsFactory.get(params).$promise.then(function (response) {
                if (response._metadata) {
                    $scope.currentPage = response._metadata.current_page;
                    $scope.lastPage = response._metadata.last_page;
                    $scope.itemsPerPage = 20;
                    $scope.totalRecords = response._metadata.total;
                    $scope.Perpage = response._metadata.per_page;
                }
                $timeout(function () {
                    $scope.labtests = response.data;
                    $scope.isShown = (response.data.length > 0) ? true : false;
                    $scope._metadata = response._metadata;
                    $scope.loader = false;
                }, 500);
            });
        };

        /* [ GET - Patient Booking Logs ] */
        $scope.getPatientBookLogs = function () {
            var Where = [];
            var api_filter = {};
            Where.push({
                "where": {}
            });
            api_filter.clinic_user_id = $rootScope.auth.id;
            Where[0].where = api_filter;
            params.filter = JSON.stringify(Where[0]);
            PatientBookingLogs.get(params).$promise.then(function (response) {
                $scope.bookingLogs = response.data;
                $scope.logLength = (response.data.length > 0) ? true : false;
            });
        };
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
                $scope.getLabTestList();
            }, 1000);
        };
        $scope.index();

        /* [ UPLOAD - ReportTest image ] */
        $scope.upload = function (file) {
            Upload.upload({
                url: '/api/v1/attachments?class=DiagnosticCenterTestPatientDiagnosticTest',
                data: {
                    file: file,
                }
            })
                .then(function (response) {
                    if (response.data.error.code === 0) {
                        
                        $scope.data.attachment = response.data.attachment;
                        $scope.error_message = '';
                    } else {
                        $scope.error_message = response.data.error.message;
                    }
                });
        };

        /*multiple image file upload */
        $scope.$on('MulitpleUploader', function (event, data) {
            $scope.imagedata = data.image_uploaded;
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
        $scope.uploadReport = function ($valid, diagnostic_center_tests_patient_diagnostic_test_id) {
            $scope.error = false;
            if ($valid && $scope.imagedata !== undefined) {
                $scope.save_btn = true;
                var labtestData = {};
                labtestData.id = diagnostic_center_tests_patient_diagnostic_test_id;
                labtestData.is_report_uploaded = 1;
                labtestData.attachment = [];
                if (angular.isDefined($scope.imagedata) && Object.keys($scope.imagedata)
                    .length > 0) {
                    angular.forEach($scope.imagedata, function (img) {
                        if (img.attachment !== undefined) {
                            labtestData.attachment.push({ "image": img.attachment });
                        }
                    });
                }
                LabTestReport.put(labtestData, function (response) {
                    if (parseInt(response.error.code) === 0) {
                        $timeout(function () {
                            $state.go('MyDiagnosticLabTests', {}, { reload: true });
                        }, 500);
                        flash.set($filter("translate")("Lab Test report added successfully."), 'success', true);
                    } else {
                        $scope.save_btn = false;
                        flash.set($filter("translate")("Lab Test report added failed."), 'error', false);
                    }
                }, function (response) {
                    flash.set($filter("translate")(response.data.error.message), 'error', false);
                });
            } else {
                $timeout(function () {
                    $('.error')
                        .each(function () {
                            if (!$(this)
                                .hasClass('ng-hide')) {
                                $scope.error = true;
                                $scope.scrollvalidate($(this)
                                    .offset().top - 140);
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
        /*  date picker start*/
        /*  today date */
        $scope.today = function () {
            $scope.dt = new Date();
        };
        $scope.today();
        $scope.clear = function () {
            $scope.dt = null;
        };
        $scope.open1 = function () {
            $scope.popup1.opened = true;
        };
        $scope.open2 = function () {
            $scope.popup2.opened = true;
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

        $scope.BookingDate = function (bookingdate) {
            $scope.appointment_date_search = $filter('date')(new Date(bookingdate), 'yyyy-MM-dd');
            $state.go('diagnostic_dashboard', {
                type: $state.params.type,
                page: $state.params.page,
                appointment_date: $scope.appointment_date_search
            });
        };
        $scope.reset_date_filter = function () {
            $state.go('diagnostic_dashboard', {
                type: $state.params.type,
                page: $state.params.page,
                appointment_date: ''
            });

        };
        $scope.appointment_date_search = $state.params.appointment_date;
        $scope.appointment_date = new Date($state.params.appointment_date);
        /*  date picker End*/
        $scope.appoinment_type = function (type) {
            $state.go('diagnostic_dashboard', {
                type: type,
                page: $state.params.page
            });
        };

        $scope.updatePayment = function (paid) {
            var labtestData = {};
            labtestData.id = $state.params.id;
            labtestData.is_paid = (paid) ? 1 : 0;
            LabTestAppointmentView.put(labtestData, function (response) {
                if (parseInt(response.error.code) === 0) {
                    flash.set($filter("translate")("Payment status updated successfully."), 'success', true);
                } else {
                    flash.set($filter("translate")("Payment status updated failed."), 'error', false);
                }
            }, function (response) {
                flash.set($filter("translate")(response.data.error.message), 'error', false);
            });
        };
    });