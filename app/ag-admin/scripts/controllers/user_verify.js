'use strict';
/**
 * @ngdoc function
 * @name ofosApp.controller:ServicelocationController
 * @description
 * # ServicelocationController
 * Controller of the getlancerv3
 */
angular.module('abs')
    .controller('UserVerifyController', function($scope, $http, $filter, $location, notification, $state, UserFactory) {
        var params = {};
        params.id = $state.params.id;
        params.filter = '{"include":{"0":"id_proof","1":"address_proof","2":"doctor_proof"}}';
        UserFactory.get(params, function (response) {
            $scope.user = response.data;
        });
         
		$scope.verified = function() {
            var params = {};
            params.id = $state.params.id;
            params.is_proof_verified = 1;      
            UserFactory.put(params, function (response) {
                if (angular.isDefined(response.error.code === 0)) {
                    notification.log($filter("translate")("Freelance doctor documents verified successfully"),{
                        addnCls: 'humane-flatty-success'
                    });
                    $location.path('/user_verification/list')
                }
            });
		};
	
    });
