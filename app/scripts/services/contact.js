'use strict';
/**
 * @ngdoc service
 * @name abs.contact
 * @description
 * # contact
 * Factory in the abs.
 */
angular.module('abs')
    .factory('contact', ['$resource', function($resource) {
        return $resource('/api/v1/contacts', {}, {
            create: {
                method: 'POST'
            }
        });
    }]);
