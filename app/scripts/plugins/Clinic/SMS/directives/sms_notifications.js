'use strict';
angular.module('abs')
    .directive('smsNotifications', function () {
        return {
            restrict: 'E',
            scope: true,
            templateUrl: 'scripts/plugins/Clinic/SMS/views/default/sms_notifications_link.html',
            controller: function ($window, $rootScope, $state, $location, $scope, $timeout, $uibModal, $uibModalStack, flash) {
                $rootScope.sendSms = function (branch_id, clinic_user_id) {
                    $rootScope.branch_id = branch_id;
                    $rootScope.clinic_user_id = clinic_user_id;
                    $scope.modalInstance = $uibModal.open({
                        templateUrl: 'scripts/plugins/Clinic/SMS/views/default/sms_notifications.html',
                        animation: true,
                        controller: function ($scope, $rootScope, $window, $stateParams, $filter, $state, $timeout, $uibModal, $uibModalStack, $cookies, flash, SendSMS, ConstUserType) {
                            $rootScope.closemodel = function () {
                                $uibModalStack.dismissAll();
                            };
                            $scope.data ={};
                             $scope.sendSms = function () {
                                    if ($scope.data) {
                                        var smsData = {};
                                        smsData.post_user_id = $rootScope.auth.id;
                                        smsData.branch_id = $rootScope.branch_id;
                                        smsData.clinic_user_id = $rootScope.clinic_user_id;
                                        smsData.message = $scope.data.message;
                                        SendSMS.post(smsData, function (response) {
                                            if (parseInt(response.error.code) === 0) {
                                                flash.set($filter("translate")("SMS send successfully"), 'success', false);
                                                $uibModalStack.dismissAll(); 
                                                 if (ConstUserType.SubAccount === $rootScope.auth.role_id) {
                                                    $location.path('/appointments/' + response.branch_id + '/' + response.clinic_user_id + '/manage/all');
                                                 } else {       
                                                    $state.go('branches');
                                                 }   
                                            } else {
                                                $scope.save_btn = false;
                                                flash.set($filter("translate")("SMS send failed."), 'error', false);
                                            }
                                        }, function (error) {
                                            console.log('SMS send Error', error);
                                        });
                                    }
                            }; 
                        },
                        size: 'lg'
                    });
                };
            }
        };
    });