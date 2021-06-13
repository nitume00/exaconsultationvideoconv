'use strict';
/**
 * @ngdoc service
 * @name baseApp.refreshToken
 * @description
 * # refreshToken
 * Factory in the baseApp.
 */
angular.module('abs')
    .factory('refreshToken', ['$resource', function($resource) {
        return $resource('/api/v1/users/refresh_token', {}, {
            get: {
                method: 'GET'
            }
        });
  }]);