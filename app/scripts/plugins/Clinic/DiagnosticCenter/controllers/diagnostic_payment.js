'use strict';
/**
 * @ngdoc function
 * @name abs.controller:DiagnosticPaymentController
 * @description
 * # AppointmentsController
 * Controller of the abs
 */
angular.module('abs')
.controller('DiagnosticPaymentController', function ($scope, $state, $filter, $rootScope, $location, AppointmentView, flash, ConstUserType, ConstAppointmentStatus, Slug, PaymentGatewayList, RaveSuccessCheckoutFactoryForDiagnostic, LabTestAppointmentView) {
        $scope.maxSize = 5;
        $scope.user = {};
        $scope.paynow_is_disabled = false;
        $scope.index = function () {
            $rootScope.pageTitle = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("Lab Test Payment");
            var params = {};
            params.id = $state.params.id;
            params.filter = '{"include":{"0":"patient.user_profile","1":"diagnostic_center_tests_patient_diagnostic_test.diagnostic_center_test.lab_test","2":"book_by_user.user_profile","3":"branch.city","4":"appointment_type","5":"appointment_status","6":"diagnostic_center_user.user_profile","7":"diagnostic_center_tests_patient_diagnostic_test.attachment"}}';
            LabTestAppointmentView.get(params).$promise.then(function (response) {
                $scope.appointment = response.data;
            });

            // Getting payment gateways
            var params = {};
            params.filter = '{"limit":"all", "skip":0}';
            PaymentGatewayList.get(params, function(payment_response) {
                var payment_gateways = new Array(); //jshint ignore:line
                $scope.gateway_count = 0;
                    if (payment_response.wallet) {
                        $scope.wallet_enabled = true;
                        if (parseInt($scope.user_available_balance) === 0) {
                            $scope.is_show_wallet_paybtn = false;
                        } else {
                            $scope.is_show_wallet_paybtn = true;
                        }
                        $scope.gateway_count = $scope.gateway_count + 1;
                    }
                    if (payment_response.PayPalREST) {
                        var response = payment_response.PayPalREST;
                        if(response.paypalrest_enabled) {
                            $scope.paypal_plugin_enabled = true;
                        }
                        $scope.gateway_count = $scope.gateway_count + 1;
                    }
                    if (payment_response.RaveByFlutterwave) {
                        var response = payment_response.RaveByFlutterwave;
                        if(response.rave_enabled) {
                            $scope.rave_plugin_enabled = true;
                            $scope.is_test_mode = response.is_test_mode;
                            $scope.public_key = response.public_key;
                        }
                        $scope.gateway_count = $scope.gateway_count + 1;
                    }
            });
        };
        $scope.payWithRave = function() {
            $scope.paynow_is_disabled = true;
            var x = getpaidSetup({
                PBFPubKey: $scope.public_key,
                customer_email: $rootScope.auth.email,
                amount: $scope.appointment.fee,
                customer_phone: $rootScope.auth.mobile,
                currency: $rootScope.settings.SITE_CURRENCY_CODE,
                country: "GH", // receives "We could not charge this card. Reason: GHS is not a supported charge currency in (NG)" error. So we passed country code as per ref of: https://developer.flutterwave.com/docs/multicurrency-payments
                txref: 'diagnostic_test-' + $state.params.id,
                payment_options: "card,mobilemoneyghana",
                /*meta: [{
                    metaname: "rave_escrow_tx",
                    metavalue: 1
                }],*/
                onclose: function() {
                    $scope.paynow_is_disabled = false;
                },
                callback: function(response) {
                    var txref = response.tx.txRef; // collect txRef returned and pass to a server page to complete status check.
                    if (response.tx.chargeResponseCode == "00" || response.tx.chargeResponseCode == "0"
                    ) {
                        $scope.paySuccess(response);
                    } else {
                        $scope.payFailed(response);
                    }
                    x.close(); // use this to close the modal immediately after payment.
                }
            });
        };
        $scope.paySuccess = function(payment_response) {
            $scope.rave_data = {};
            $scope.rave_data.id = $state.params.id;
            $scope.rave_data.txRef = payment_response.tx.txRef;
            $scope.rave_data.flwRef = payment_response.tx.flwRef;
            $scope.rave_data.response = JSON.stringify(payment_response);
            var flashMessage;
            RaveSuccessCheckoutFactoryForDiagnostic.put($scope.rave_data, function (response) {
                $scope.paynow_is_disabled = false;
                if (response.error.code === 0) {
                    flash.set($filter("translate")("Your payment has been completed successfully."), 'success', true, 8000);
                    if (angular.isDefined(response.data.id)) {
                        $state.go('diagnostic_labtest_view', {'id': response.data.id});
                    }
                } else if (response.error.code === 512) {
                    flash.set($filter("translate")("Payment Failed. Please, try again."), 'error', false);
                } else {
                    flashMessage = $filter("translate")("We are unable to place your order. Please try again.");
                    if(response.error.message !== '') {
                        flashMessage = flashMessage + ' Error: ' + response.error.message;
                    }
                    flash.set(flashMessage, 'error', false);
                }
            }, function (error) {
                $scope.paynow_is_disabled = false;
                flash.set($filter("translate")("We are unable to place your order. Please try again."), "error", false);
            });
        };
        $scope.payFailed = function(payment_response) {
            $scope.paynow_is_disabled = false;
            flash.set($filter("translate")("Payment Failed. Please, try again."), 'error', false);
        };
        $scope.index();
    });