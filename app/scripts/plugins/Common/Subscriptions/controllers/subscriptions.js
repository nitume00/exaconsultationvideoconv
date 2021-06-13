'use strict';
/**
 * @ngdoc function
 * @name abs.controller:ClinicController
 * @description
 * # ClinicController
 * Controller of the abs
 */

angular.module('abs')
.controller('SubscribePlansController', function ($scope, $state, $rootScope, $filter) {
    $rootScope.pageTitle = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("Plans");
})
.controller('subscriptionsPlanController', function ($state, SubscriptionsPlans, $scope, $rootScope, flash, $filter, GetSubscriptionDetail, paymentGateways, PaymentGatewayList, RaveSubscriptionCheckoutFactory, UserSubscriptionFactory, ConstSubscriptionStatuses, MyUserSubscription, SweetAlert, UpdateUserSubscription, $cookies) {
    $rootScope.pageTitle = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("Subscriptions");
    $scope.subscription_plans = {};
    $scope.subscription_loader = true;
    $scope.ConstSubscriptionStatuses = ConstSubscriptionStatuses;
    $scope.plan_selected = false;
    if (parseInt($state.params.error_code) === 0) {
        flash.set($filter("translate")("Your subscription successfully completed."), "success", false);
    } else if (parseInt($state.params.error_code) === 512) {
        flash.set($filter("translate")("Unable to process your request. Please try again later."), "error", false);
    }
    function getGatewaysList() {
        $scope.loading = false;
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
    }
    function getSubscriptionsPlans() {
        SubscriptionsPlans.get().$promise.then(function (response) {
            $scope.subscription_plans = response;
            getGatewaysList();
            $scope.subscription_loader = false;
        });
    }
    function getCurrentPlan() {
        var params = {};
        params.filter = {};
        params.filter.where = {};
        params.filter.where.subscription_status_id = ConstSubscriptionStatuses.Active;
        MyUserSubscription.get(params).$promise.then(function (response) {
            $scope.current_subscription_plans = response.data;
        });
    }
    getSubscriptionsPlans();
    getCurrentPlan();
    $scope.getSubscribePlan = function(plan_id) {
        $scope.plan_selected = true;
        $scope.loader = true;
        GetSubscriptionDetail.get({
            id: plan_id
        }).$promise.then(function (response) {
            $scope.subscriptions = response.data;
            $scope.selected_plan = plan_id;
            $scope.loader = false;
        });
    };
    $scope.rePlan = function() {
        $scope.plan_selected = false;
    };
    $scope.cancelPlan = function(user_subscription_id) {
        SweetAlert.swal({
            title: $filter("translate")("Are you sure to cancel this subscription?"),
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
            if(isConfirm) {
                var params = {};
                params.id = user_subscription_id;
                params.subscription_status_id = ConstSubscriptionStatuses.Canceled;
                UpdateUserSubscription.put(params).$promise.then(function (response) {
                    var flashMessage;
                    if (response.error.code === 0) {
                        flash.set($filter("translate")("Subscription canceled successfully."), 'success', true);
                        getCurrentPlan();
                    } else {
                        flash.set($filter("translate")("Subscription could not be canceled. Please try again."), 'success', true);
                    }
                });
            }
        });
    };
    $scope.payWithRave = function() {
        $scope.paynow_is_disabled = true;
        var params = {};
        params.subscription_id = $scope.subscriptions.id
        params.subscription_status_id = 1;
        UserSubscriptionFactory.post(params, function (user_subscription_response) {
            $scope.user_subscription = user_subscription_response.data;
            var x = getpaidSetup({
                PBFPubKey: $scope.public_key,
                customer_email: $rootScope.auth.email,
                amount: $scope.subscriptions.price,
                customer_phone: $rootScope.auth.mobile,
                currency: $rootScope.settings.SITE_CURRENCY_CODE,
                country: "GH", // receives "We could not charge this card. Reason: GHS is not a supported charge currency in (NG)" error. So we passed country code as per ref of: https://developer.flutterwave.com/docs/multicurrency-payments
                txref: 'user_subscription_id-' + $scope.user_subscription.id,
                payment_plan: $scope.subscriptions.rave_plan_id,
                payment_options: "card,mobilemoneyghana",
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
                    $scope.plan_selected = false;
                }
            });
            $scope.paynow_is_disabled = false;
        });
    };
    $scope.paySuccess = function(payment_response) {
        $scope.rave_data = {};
        $scope.rave_data.user_subscription_id = $scope.user_subscription.id;
        $scope.rave_data.id = payment_response.tx.id;
        $scope.rave_data.txRef = payment_response.tx.txRef;
        $scope.rave_data.flwRef = payment_response.tx.flwRef;
        $scope.rave_data.response = JSON.stringify(payment_response);
        var flashMessage;
        RaveSubscriptionCheckoutFactory.post($scope.rave_data, function (response) {
            $scope.paynow_is_disabled = false;
            $scope.auth_user_detail = $cookies.getObject("auth");
            $scope.auth_user_detail.is_plan_subscribed = 1;
            $cookies.put('auth', JSON.stringify($scope.auth_user_detail), {
                path: '/'
            });
            if (response.error.code === 0) {
                flash.set($filter("translate")("Your subscription has been completed successfully."), 'success', true, 8000);
                if (angular.isDefined(response.data.id)) {
                    getCurrentPlan();
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
    //  updating payment gatways assigning while changing the tab
    $scope.paymentGatewayUpdate = function (pane) {
        $scope.payment_tab = pane;
    };
}); 