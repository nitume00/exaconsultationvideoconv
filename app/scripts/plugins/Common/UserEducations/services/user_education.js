'use strict';
/**
 * @ngdoc service
 * @name abs.UserEducationFactory
 * @description
 * # UserEducationFactory
 * Factory in the abs.
 */
angular.module('abs')
    .factory('UserEducations', ['$resource', function($resource) {
        return $resource('/api/v1/user_educations', {}, {
            get: {
                method: 'GET'
            },
            post: {
                method: 'POST'
            }
        });
    }])
    .factory('UserEducationAdd', ['$resource', function($resource) {
        return $resource('/api/v1/user_profiles', {}, {
            update: {
                method: 'PUT'
            },
            get: {
                method: 'GET'
            }
        });
    }])
    .factory('UserEducationEditFactory', ['$resource', function($resource) {
        return $resource('/api/v1/user_educations/:id', {
            id: '@id'
        }, {
            get: {
                method: 'GET'
            },
            put: {
                method: 'PUT'
            },
            delete: {
                method: 'DELETE'
            }
    });
}]);
     