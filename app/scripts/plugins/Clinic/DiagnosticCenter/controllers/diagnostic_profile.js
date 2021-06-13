'use strict';
/**
 * @ngdoc function
 * @name abs.controller:ClinicController
 * @description
 * # ClinicController
 * Controller of the abs
 */
angular.module('abs')
    /**
     * @ngdoc controller
     * @name user.controller:ClinicController
     * @description
     *
     * This is user controller having the methods setmMetaData, init, upload and user_profile.
     **/
.controller('DiagnosticController', function ($scope, $state, $rootScope, $filter, $location, $auth, flash,$anchorScroll, ConstUserType, BranchesFactory, UserViewProfileFactory, DiagnosticCenterTestsFactory, UserReviews, UserAppointment,md5, NgMap, $timeout) {
        /**
         * @ngdoc method
         * @name init
         * @methodOf user.controller:ClinicController
         * @description
         * This method will initialze the page. It returns the page title.
         *
         **/
        $scope.init = function () {
            $rootScope.pageTitle = $rootScope.settings.SITE_NAME + " | " + $filter("translate")("View Profile") + " | " + $state.params.slug;
             $scope.currentPage = ($scope.currentPage !== undefined) ? parseInt($scope.currentPage) : 1;
             NgMap.getMap().then(function(map) {
                 $scope.map = map;
             });
        };
        var params = {};
        params.id =  $state.params.id; 
        params.filter = '{"include":{"0":"attachment","1":"user_profile","2":"user_profile.city","3":"user_profile.state","4":"user_profile.country"}}';
        UserViewProfileFactory.get(params).$promise.then(function (response) {
            $scope.user = response.data;
            if (angular.isDefined($scope.user.attachment) && $scope.user.attachment !== null) {
                    var hash = md5.createHash($scope.user.attachment.class + $scope.user.attachment.id + 'png' + 'large_thumb');
                    $scope.user.user_image= 'images/large_thumb/' + $scope.user.attachment.class + '/' + $scope.user.attachment.id + '.' + hash + '.png';
            } else {
                    $scope.user.user_image = 'images/default.png';
            }
             
        });
        $scope.init();
       
        $scope.isAuthenticated = function () {
            return $auth.isAuthenticated();
        };
        $scope.getReviewsList = function () {
            params = { 'doctor_id': $scope.userId, 'page': $scope.currentPage };
            UserReviews.get(params).$promise.then(function (response) {
                $scope.doctorReviews = response.data;
                $scope._metadata = response.meta.pagination;
                $scope.metadata = response.meta.pagination;
            });
        };
        /**
         * @ngdoc method
         * @name paginate
         * @methodOf appointments.controller:AppointmentsController
         * @description
         *
         * This method will be load pagination the pages.
         **/
        $scope.paginate = function () {
            $scope.currentPage = parseInt($scope.currentPage);
            $scope.getReviewsList();
        };
        /* [ GET - Map Positions ] */
        $scope.mapDisplay = function(branchData) {
             
                angular.forEach(branchData, function (value, key) {
                    var cityValue = "";
                    if (typeof value !== "undefined") {  
                        if (typeof value.city !== "undefined") {
                            cityValue = ","+value.city.name+",";
                        }
                        var postal_codeValue = "";
                        if (typeof value.postal_code !== "undefined") {
                            postal_codeValue = ","+value.postal_code+",";
                        }
                        var countryValue = "";
                        if (typeof value.country !== "undefined") {
                            countryValue = ","+value.country.name+",";
                        }
                        if (typeof value.latitude !== "undefined" && typeof value.longitude !== "undefined" && value.latitude !== null && value.longitude !== null) {
                            var formattedAddress = postal_codeValue + cityValue + countryValue,
                                formattedAddressResult = formattedAddress.substring(1, formattedAddress.length-1).replace(/,,/g, ",");
                                $scope.positions.push({
                                    id: key,
                                    branch:value.name,
                                    address1:value.address,
                                    address2:formattedAddressResult,
                                    lat: value.latitude,
                                    lon: value.longitude
                                });
                        }
                    }   
                });
         };
         $scope.showDetail = function (e, branchInfo) {
            $scope.branchInfo = branchInfo;
            $scope.map.showInfoWindow('branch-info', branchInfo.id);
        };
        // Get Single message
        $scope.GetLabTests = function(branch_id, diagnostic_center_user_id) {
            $scope.loader = true;
            var params = {};
            $scope.active_id = branch_id;
            params.filter = '{"where":{"diagnostic_center_user_id":' + diagnostic_center_user_id + ', "branch_id":'+ branch_id +'},"include":{"0":"diagonostic_test_image","1":"lab_test"}}';
            DiagnosticCenterTestsFactory.get(params, function(response) {
                $timeout(function() {
                    $scope.loader = false;
                    $scope.labtests = response.data;
                    $scope.testLength = (response.data.length > 0) ? true : false;
                    angular.forEach($scope.labtests, function(lab, key) {
                        if ($scope.labtests[key].diagonostic_test_image !== null) {
                            $scope.labtests[key].lab_image = 'images/big_thumb/DiagonosticTest/' + lab.diagonostic_test_image.id + '.' + md5.createHash('DiagonosticTest' + lab.diagonostic_test_image.id + 'png' + 'big_thumb') + '.png';
                        } else {
                            $scope.labtests[key].lab_image = 'images/diagnostic_image.jpg';
                        }
                    });
                }, 500);          
            });
        };

        /* Get all branches function*/
        $scope.GetAllBranches = function() {
            var params = {};
            params.filter = '{"where":{"clinic_user_id":' + $rootScope.auth.id + ', "is_active":"1"},"include":{"0":"city","1":"country"}}';
            $scope.positions = [];
            BranchesFactory.get(params, function(response) {
                    $scope.branches = response.data;
                    $scope.dataLength = (response.data.length > 0) ? true : false;
                    $scope.mapDisplay($scope.branches);
                    $scope.mappositions = $scope.positions;
                if ($scope.branches.length > 0) {
                    $scope.GetLabTests($scope.branches[0].id, $scope.branches[0].clinic_user_id);
                }
            });
        };
        $scope.GetAllBranches();
    });