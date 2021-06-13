'use strict';
/**
 * @ngdoc service
 * @name ofos.paymentGateway
 * @description
 * # paymentGateway
 * Factory in the ofos.
 */
angular.module('abs')
    .factory('paymentGateway', function($resource) {
        return $resource('/api/v1/payment_gateway_settings/:id', {}, {
            update: {
                method: 'PUT',
                params: {
                    id: '@id'
                }
            }
        });
    })
    .factory('Appointment', ['$resource', function($resource) {
        return $resource('/api/v1/appointments/:id', { id : '@id'}, {
            get: {
                method: 'GET'
            }
             
        });
    }])
    .factory('offlinePayment', function($resource) {
        return $resource('/api/v1/appointments/offline/:id', {}, {
            update: {
                method: 'PUT',
                params: {
                    id: '@id'
                }
            }
        });
    });