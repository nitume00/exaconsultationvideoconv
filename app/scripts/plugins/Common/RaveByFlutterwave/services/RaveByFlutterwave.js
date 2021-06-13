'use strict';
/**
 * @ngdoc service
 * @name abs.RaveByFlutterwaveServicesFactory
 * @description
 * # RaveByFlutterwaveServicesFactory
 * Factory in the abs.
 */
angular.module('abs')
   .factory('RaveSuccessCheckoutFactory', ['$resource', function($resource) {
        return $resource('/api/v1/appointments/rave_payment_success/:id', {
            id: '@id'
        }, {
            put: {
                method: 'PUT'
            } 
        });
    }])
    .factory('RaveSuccessCheckoutFactoryForDiagnostic', ['$resource', function($resource) {
        return $resource('/api/v1/patient_diagnostic_tests/rave_payment_success/:id', {
            id: '@id'
        }, {
            put: {
                method: 'PUT'
            } 
        });
    }])
    .factory('RaveSubscriptionCheckoutFactory', ['$resource', function($resource) {
        return $resource('/api/v1/user_subscription_logs/rave_payment_success', {
        }, {
            post: {
                method: 'POST'
            } 
        });
    }]);