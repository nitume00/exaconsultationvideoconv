'use strict';
/**
 * @ngdoc service
 * @name olxApp.ChangePasswordFactory
 * @description
 * # ChangePasswordFactory
 * Factory in the olxApp.
 */
angular.module('abs')
    .factory('ChangePasswordFactory', function($resource) {
        return $resource('/api/v1/users/:id/change_password', {}, {
            update: {
                method: 'PUT',
                params: {
                    id: '@id'
                }
            }
        });
    })
    .factory('UserFactory', ['$resource', function($resource) {
        return $resource('/api/v1/users/:id', { id : '@id'}, {
            get: {
                method: 'GET'
            },
            put: {
                method: 'PUT'
            }  
        });
    }]);

    