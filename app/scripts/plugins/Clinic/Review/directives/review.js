'use strict';
/**
 * @ngdoc directive
 * @name abs.directive:reviews
 * @description
 * # pages
 */
'use strict';
angular.module('abs')
	.directive('reviewPost', function ($filter) {
        return {
            restrict: 'E',
            templateUrl: 'scripts/plugins/Clinic/Review/views/default/review_booking.html',
            scope: true,
            controller:"ReviewsController"
        };
    }).directive('reviewShow', function ($filter) {
        return {
            restrict: 'E',
            templateUrl: 'scripts/plugins/Clinic/Review/views/default/reviews.html',
            scope: {
               showreview: '@'
            },
            controller:function($scope, $rootScope, UserViewProfileFactory, UserReviews, $state, $window, $timeout,$location, ConstUserType){
                 $scope.reviews = [];
                 $scope.ConstUserType = ConstUserType;
                 var params = {};
                 params.id = $state.params.id;
                 params.filter = '{"include": {"0":"user_profile"}}';
                 UserViewProfileFactory.get(params).$promise.then(function (response) {
                      $scope.doctor = response.data;
                      $scope.name = ($scope.doctor.role_id === $scope.ConstUserType.Doctor) ? $filter("translate")("Dr")+'. '+$scope.doctor.user_profile.first_name +' '+ $scope.doctor.user_profile.last_name: $scope.doctor.user_profile.display_name;
                 });
                 $scope.skip = 0;
                 $scope.getReviews = function() {
                    $scope.loader = true;  
                    $scope.limit = 4;
                    params = {};
                    var api_filter = {};
                    var Where = [];
                    Where.push({
                        "where": {},
                        "include": {}
                    });
                    if($scope.showreview ==='doctor') {
                        api_filter = {
                            'to_user_id': $state.params.id,
                            'foreign_type' : 'Appointment'
                        };
                    } else {
                       api_filter = {
                            //'clinic_user_id': $state.params.id,
                            'branch_id': $state.params.id,
                            'foreign_type' : 'Branch'
                        }; 
                    }   
                    Where[0].include[0] = 'user';
                    Where[0].include[1] = 'user.attachment';
                    Where[0].include[2] = 'user.user_profile';
                    Where[0].include[3] = 'to_user.user_profile';
                    Where[0].where = api_filter;
                    Where[0].limit = $scope.limit;
                    Where[0].skip = $scope.skip;
                    params.filter = JSON.stringify(Where[0]);
                    UserReviews.get(params).$promise.then(function (response) {
                           if (angular.isDefined(response._metadata)) {
                                 $scope.lastpage = response._metadata.last_page;
                                 $scope.currentpage = response._metadata.current_page;
                           }
                           $scope.dataLength = (response.data.length > 0) ? true : false;  
                           $timeout(function () {
                                if (angular.isDefined(response.data)) {
                                        angular.forEach(response.data, function(review) {
                                            $scope.reviews.push(review);
                                        });
                                    $scope.loader = false;
                                }
                           }, 500);     
                    });
                 };
                 $scope.index = function() {
                      $scope.getReviews();
                 };
                 $scope.loadMore = function() {
                    $scope.skip += 4;
                    $scope.getReviews();
                 }
                 $scope.index();
            }
        };
    });
