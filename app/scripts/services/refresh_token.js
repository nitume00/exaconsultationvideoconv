'use strict';
/**
 * @ngdoc service
 * @name abs.refreshToken
 * @description
 * # refreshToken
 * Factory in the abs.
 */
angular.module('abs')
    .factory('refreshToken', ['$resource', function($resource) {
        return $resource('/api/v1/users/refresh_token', {}, {
            get: {
                method: 'GET'
            }
        });
  }]);
