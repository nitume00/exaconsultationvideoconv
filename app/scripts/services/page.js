'use strict';
/**
 * @ngdoc service
 * @name abs.page
 * @description
 * # page
 * Factory in the abs.
 */
angular.module('abs')
    .factory('page', ['$resource', function($resource) {
        return $resource('/api/v1/pages/:id', {id: '@id'}, {
            get: {
                method: 'GET',
            }
        });
    }]);
