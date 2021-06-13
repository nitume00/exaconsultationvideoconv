'use strict';
/**
 * @ngdoc service
 * @name abs.wallet
 * @description
 * # wallet
 * Factory in the abs.
 */
angular.module('abs.Common.Wallet')
    .factory('wallet', ['$resource', function($resource) {
        return $resource('/api/v1/wallets', {}, {
            create: {
                method: 'POST'
            }
        });
    }]).factory('UserMeFactory', ['$resource', function($resource) {
        return $resource('/api/v1/me', {}, {
            get: {
                method: 'GET'
            }
        });
    }]) .factory('paymentGateways', ['$resource', function($resource) {
        return $resource('/api/v1/payment_gateways/list', {}, {
            get: {
                method: 'GET'
            }
        });
    }]);