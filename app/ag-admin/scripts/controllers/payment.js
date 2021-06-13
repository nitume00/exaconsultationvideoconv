'use strict';
/**
 * @ngdoc function
 * @name abs.controller:PaymentGatewayCtrl
 * @description
 * # PaymentGatewayCtrl
PaymentGatewayCtrl * Controller of the abs
 */
angular.module('abs')
    .controller('PaymentCtrl', function($scope, $filter, $location, notification, $state, Appointment, offlinePayment) {
         
        var params = {};
        $scope.data = {};
        params.id = $state.params.id;
        Appointment.get(params, function (response) {
            $scope.appointment = response.data;
            $scope.data.id = $scope.appointment.id;
            $scope.data.is_paid = $scope.appointment.is_paid;
            $scope.data.payment_note = $scope.appointment.payment_note;
        });
         
		$scope.payOffline = function($valid) {
            if ($valid) {
                var offlineData = {};
                offlineData.id = $scope.data.id;
                offlineData.is_paid = $scope.data.is_paid;
                offlineData.payment_note = $scope.data.payment_note;
                console.log(offlineData, 'data');
                offlinePayment.update(offlineData).$promise.then(function (response) {
                    if (angular.isDefined(response.error.code === 0)) {
                        notification.log($filter("translate")("Paid status changed successfully"),{
                            addnCls: 'humane-flatty-success'
                        });
                        $location.path('/offline_appointments/list')
                    }
                });
            }
		};
    });