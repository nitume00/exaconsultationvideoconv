'use strict';
/**
 * @ngdoc function
 * @name abs.controller:BranchesController
 * @description
 * # BranchesController
 * Controller of the abs
 */
angular.module('abs')

    .controller('ClinicAppointmentsController', function ($state, $rootScope, $scope, $filter, $location, $timeout, flash, SweetAlert, BranchesFactory, ClinicAppointmentFactory, ConstAppointmentStatus, AppointmentView, ConstUserType, Slug, ConstStatusColor) {

        $rootScope.pageTitle = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("Appointments");
        $scope.ConstAppointmentStatus = ConstAppointmentStatus;
        $scope.ConstUserType = ConstUserType;
        $scope.ConstStatusColor = ConstStatusColor;
        $scope.maxSize = 5;
        $scope.user = {};
        $scope.user.role_id = parseInt($rootScope.auth.role_id);
        var params = {};
        $scope.lastPage = 1;
        $scope.itemsPerPage = 20;
        $scope.branch_id = 'all';
        //Select appointment status List
        $scope.appoinment_statuses = [];
        $scope.appoinment_statuses.push(
            { 'id': 2, "name": $filter("translate")('Approved') },
            { 'id': 7, "name": $filter("translate")('Present') },
            { 'id': 4, "name": $filter("translate")('Cancelled') },
            { 'id': 3, "name": $filter("translate")('Closed') },
            { 'id': 0, "name": $filter("translate")('All Status') }
        );
        $scope.appointment_status_id = ConstAppointmentStatus.Approved;
        /**
          * @ngdoc method
          * @name BranchesController.branch
          * @methodOf module.BranchesController
          * @description
          * This method is used to get the clinic branches listing
         */
        $scope.index = function () {
            $scope.currentPage = ($scope.currentPage !== undefined) ? parseInt($scope.currentPage) : 1;
            $state.params.type = ($state.params.type !== undefined) ? $state.params.type : 'approved';
            $scope.paramsType = $state.params.type;
            if ($state.current.name === 'Appointments') {
                $rootScope.pageTitle = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("My Appointments");
                $scope.mybranches();
                $scope.getAppointmentList($scope.paramsType, $scope.branch_id);
            } else if (($state.current.name === 'AppointmentView')) {
                $rootScope.pageTitle = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("Appointment Detail");
                params.id = $state.params.id;
                params.filter = '{"include":{"0":"user.user_profile","1":"provider_user.user_profile","2":"clinic_user","3":"book_by_user.user_profile","4":"branch","5":"appointment_type","6":"appointment_status","7":"specialty_disease"}}';
                AppointmentView.get(params).$promise.then(function (response) {
                    $scope.appointment = response.data;
                    var name = $scope.appointment.provider_user.user_profile.first_name + ' ' + $scope.appointment.provider_user.user_profile.last_name;
                    $scope.doctorSlug = Slug.slugify(name);
                    $scope.todayDateTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm');

                });
            }
            $scope.changeappointstatus = function (status) {
                if (status == 'confirm') {
                    titleText = "Are you sure to Confirm this Appointment?";
                } else if (status == 'decline') {
                    titleText = "Are you sure to Decline this Appointment?";
                } else if (status == 'cancel') {
                    titleText = "Are you sure to Cancel this Appointment?";
                } else if (status == 'present') {
                    titleText = "Are you sure to change Present this Appointment?";
                } else if (status == 'close') {
                    titleText = "Are you sure to Closed this Appointment?";
                } else if (status == 'expiry') {
                    titleText = "Are you sure to Expired this Appointment?";
                }
                SweetAlert.swal({
                    title: $filter("translate")(titleText),
                    text: "",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: $filter("translate")("Confirm"),
                    cancelButtonText: $filter("translate")("No"),
                    closeOnConfirm: true,
                    closeOnCancel: true
                },
                    function (isConfirm) {
                        if (isConfirm) {
                            ChangeStatus.get({ id: $state.params.id, apt_status: status }).$promise.then(function (response) {
                                flash.set($filter("translate")(response.Success), 'success', true);
                                $location.path('/appointments/approved');
                            });
                        }
                    });
            };
        };
        $scope.loader = true;
        /* [ GET - Appointment List - Clinic Users] */
        $scope.getAppointmentList = function (param_type, branch_id) {
            var Where = [];
            var api_filter = {};
            var Filter = [];
            Where.push({
                "where": {},
                "include": {}
            });
            Filter.push({
                "where": {},
                "include": {}
            });
            api_filter.clinic_user_id = $rootScope.auth.id;
            if (param_type === 'approved') {
                api_filter.appointment_status_id = ConstAppointmentStatus.Approved;
            } else if (param_type === 'present') {
                api_filter.appointment_status_id = ConstAppointmentStatus.Present;
            } else if (param_type === 'closed') {
                api_filter.appointment_status_id = ConstAppointmentStatus.Closed;
            } else if (param_type === 'cancelled') {
                api_filter.appointment_status_id = ConstAppointmentStatus.Cancelled;
            } else {
                api_filter.appointment_status_id = {};
                api_filter.appointment_status_id['nin'] = [ConstAppointmentStatus.PaymentPending];
            }
            if (branch_id !== 'all') {
                api_filter.branch_id = branch_id;
                $scope.branch_id = branch_id;
            }
            $scope.currentPage = (angular.isDefined($state.params.page)) ? parseInt($state.params.page) : 1;
            $scope.skipvalue = $scope.itemsPerPage !== undefined ? ($scope.currentPage - 1) * $scope.itemsPerPage : 0;
            $scope.itemsPerPage = $scope.itemsPerPage !== undefined ? $scope.itemsPerPage : 0;
            Where[0].include[0] = 'user.user_profile';
            Where[0].include[1] = 'provider_user.user_profile';
            Where[0].include[2] = 'clinic_user';
            Where[0].include[3] = 'book_by_user.user_profile';
            Where[0].include[4] = 'branch';
            Where[0].include[5] = 'appointment_type';
            Where[0].include[6] = 'appointment_status';
            Where[0].include[7] = 'specialty_disease';
            Where[0].where = api_filter;
            Where[0].skip = $scope.skipvalue;
            Where[0].limit = $scope.itemsPerPage;
            Where[0].order = 'id desc';
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
                }, 500);
            });
        };
        /* [ GET - All Branches - Clinic Users] */
        $scope.mybranches = function () {
            params.filter = '{"where":{"is_active": 1,"clinic_user_id":' + $rootScope.auth.id + '}}';
            BranchesFactory.get(params, function (response) {
                if (angular.isDefined(response.data)) {
                    $scope.branches = response.data;
                    $scope.dataLength = (response.data.length > 0) ? true : false;
                }
            });
        };
        /**
        * @ngdoc method
        * @name BranchesController.paginate
        * @methodOf module.BranchesController
        * @description
        * This method is used to get the branch listing
        */
        /*    $scope.paginate = function() {
              $scope.currentPage = parseInt($scope.currentPage);
              $scope.getAppointmentList();
            };*/
        $scope.paginate_search = function (element, currentPage) {
            $scope.currentPage = currentPage;
            $location.search('page', currentPage);
            $('html, body').stop().animate({ scrollTop: 0 }, 1000, 'swing', false);
            $timeout(function () {
                /*$scope.search(element);*/
                $scope.getAppointmentList();
            }, 1000);
        };
        /**
        * @ngdoc method
        * @name BranchesController.statuschange
        * @methodOf module.BranchesController
        * @description
        * This method is used to status change for the branch 
        */
        $scope.changeStatus = function (branch_id, status) {
            var branchData = {};
            branchData.id = branch_id;
            branchData.is_active = status;
            SweetAlert.swal({
                title: $filter("translate")("Are you sure you want to change the status?"),
                text: "",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: $filter("translate")("OK"),
                cancelButtonText: $filter("translate")("Cancel!"),
                closeOnConfirm: true,
                animation: false,
            }, function (isConfirm) {
                if (isConfirm === true) {
                    BranchesEdit.put(branchData, function (response) {
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
              $state.go('Appointments', {
                type: $state.params.type,
                page: $state.params.page,
                appointment_date: $scope.appointment_date_search
            });
        };
        $scope.reset_date_filter = function () {
            $state.go('Appointments', {
                type: $state.params.type,
                appointment_date: '',
                page: $state.params.page,
              });

        };
        $scope.appointment_date_search = $state.params.appointment_date;
        $scope.appointment_date = new Date($state.params.appointment_date);
        /*  date picker End*/
        $scope.appoinment_type = function(type)
        {
            $state.go('Appointments', {
                type: type,
                page: $state.params.page,
            });
        };
        $scope.index();
    });