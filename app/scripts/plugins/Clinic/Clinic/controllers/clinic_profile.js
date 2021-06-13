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
.controller('ClinicController', function ($scope, $state, $rootScope, $filter, $location, $auth, $timeout, flash,ConstClinicTypes, ConstUserType, BranchesFactory, UserViewProfileFactory, MyDoctorsFactory, UserReviews, UserAppointment,md5, ConstGenders, NgMap) {
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
             $scope.ConstClinicTypes = ConstClinicTypes;
        };
        var params = {};
        params.id =  $state.params.id; 
        params.filter = '{"include":{"0":"attachment","1":"user_profile","2":"user_profile.city","3":"user_profile.country"}}';
        UserViewProfileFactory.get(params).$promise.then(function (response) {
            $scope.user = response.data;
            if (angular.isDefined($scope.user.attachment) && $scope.user.attachment !== null) {
                    var hash = md5.createHash($scope.user.attachment.class + $scope.user.attachment.id + 'png' + 'small_thumb');
                    $scope.user.user_image= 'images/small_thumb/' + $scope.user.attachment.class + '/' + $scope.user.attachment.id + '.' + hash + '.png';
            } else {
                    $scope.user.user_image = 'images/default.png';
            }
            if ($rootScope.settings.SITE_ENABLED_PLUGINS.indexOf('Clinic/Review') > -1=== true){
                /* For get all reviews */
            //    $scope.getReviewsList();
                /* For check the Auth User is a Patient & if Auth User is a patient is alreay added a reivew or Not */
                if ($auth.isAuthenticated()) {
                    if ($rootScope.auth.role_id === ConstUserType.User) {
                        /* For Check the auth user is vist the doctor at once */
                        UserAppointment.get({
                            doctor_id: $scope.userId,
                            user_id: $rootScope.auth.id
                        }).$promise.then(function (Appointmentresponse) {
                            $scope.isAlreadyVisted = Appointmentresponse.data.is_visited;
                            if ($scope.isAlreadyVisted === true) {
                                $scope.isvisited = true;
                                UserReviews.get({
                                    doctor_id: $scope.userId,
                                    user_id: $rootScope.auth.id
                                }).$promise.then(function (reviewResponse) {
                                    $scope.authUserAddedReview = reviewResponse.data;
                                    $scope.userReviewData = reviewResponse.status;
                                    if ($scope.userReviewData === true) {
                                        /* for template side block regard */
                                        $scope.reviewEnable = false;
                                        $scope.alreadyadded = true;
                                    } else {
                                        /* for template side block regard */
                                        $scope.reviewEnable = true;
                                        $scope.alreadyadded = false;
                                    }
                                });
                            } else {
                                $scope.reviewEnable = false;
                                $scope.isvisited = false;
                            }
                        });
                    } else {
                        $scope.reviewEnable = false;
                        /* for template side block reg */
                    }
                }
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
        /**Info Map**/
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
                                    id: value.id,
                                    branch:value.name,
                                    address1:value.address,
                                    address2:formattedAddressResult,
                                    city: cityValue,
                                    country: countryValue,
                                    postal_code: value.postal_code,
                                    lat: value.latitude,
                                    lon: value.longitude
                                });
                        }
                    }   
                });
         };
         
         NgMap.getMap().then(function(map) {
            $scope.map = map;
         });
         $scope.showDetail = function (e, branchInfo) {
            $scope.branchInfo = branchInfo;
            $scope.map.showInfoWindow('branch-info', branchInfo.id);
         };
        
        // Get Single message
        $scope.GetDoctors = function(branch_id, clinic_user_id) {
            $scope.loader = true;
            $scope.active_id = branch_id;
            var params = {};
            params.filter = '{"where":{"clinic_user_id":' + clinic_user_id + ', "branch_id":'+ branch_id +'},"include":{"0":"branch","1":"user","2":"user.user_profile","3":"user.attachment","4":"user.user_profile.city","5":"user.user_profile.country","6":"branch.branches_specialty.specialty","7":"branch.branches_insurance.insurance","8":"user.primary_speciality"}}';
            MyDoctorsFactory.get(params, function(response) {
                $timeout(function() {
                        $scope.loader = false;
                        $scope.doctors = response.data;
                        $scope.doctorLength = (response.data.length > 0) ? true : false;
                        angular.forEach($scope.doctors, function(doctoruser, key) {
                            var provider_user = doctoruser;
                            provider_user.user.user_image = (provider_user.user.user_profile.gender_id === ConstGenders.Female) ? 'images/femaledoctor.jpg' : 'images/maledoctor.jpg'; 
                            if (angular.isDefined(provider_user.user.attachment) && provider_user.user.attachment !== null) {
                                provider_user.user.user_image = 'images/normal_thumb/UserAvatar/' + provider_user.user.attachment.id + '.' + md5.createHash('UserAvatar' + provider_user.user.attachment.id + 'png' + 'normal_thumb') + '.png';
                            } 
                            $scope.doctors[key].user.user_image = provider_user.user.user_image;
                    });
               }, 500);      
            });
        };

        /* Get all branches function*/
        $scope.GetAllBranches = function() {
            var params = {};
            params.filter = '{"where":{"clinic_user_id":' + $state.params.id + ', "is_active":"1"},"include":{"0":"city","1":"country"},"limit":50,"skip":0}';
            $scope.positions = [];
            $scope.mapCenter = '';
            BranchesFactory.get(params, function(response) {
                    $scope.branches = response.data;
                    $scope.dataLength = (response.data.length > 0) ? true : false;
                    $scope.mapDisplay($scope.branches);
                    $scope.mappositions = $scope.positions;
                    $scope.mapCenter= [$scope.positions[0].lat,$scope.positions[0].lon];
                if ($scope.branches.length > 0) {
                    $scope.GetDoctors($scope.branches[0].id, $scope.branches[0].clinic_user_id);
                }
            });
        };
        $scope.GetAllBranches();
    });