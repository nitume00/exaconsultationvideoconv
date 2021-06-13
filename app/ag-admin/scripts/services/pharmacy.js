'use strict';
/**
 * @ngdoc service
 * @name getlancerv3.servicelocation
 * @description
 * # paymentGateway
 * Factory in the getlancerv3.
 */
angular.module('abs')
.factory('PrescriptionAction', ['$resource', function($resource) {
    return $resource('/api/v1/prescriptions/:id', {
            id: '@id'
    }, {
        get :{
            method: 'GET'
        },
        put: {
            method: 'PUT'
        }            
    });
}]);    