'use strict';
/**
 * @ngdoc service
 * @name ofos.zazpaySynchronize
 * @description
 * # zazpaySynchronize
 * Factory in the ofos.
 */
angular.module('abs')
    .factory('zazpaySynchronize', function($resource) {
        return $resource('/api/v1/payment_gateways/zazpay_synchronize', {}, {
            get: {
                method: 'GET'
            }
        });
    });