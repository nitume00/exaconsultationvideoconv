'use strict';
/**
 * @ngdoc service
 * @name ofos.postGateways
 * @description
 * # postGateways
 * Factory in the ofos.
 */
angular.module('abs')
    .factory('postGateways', ['$resource', function($resource) {
        return $resource('/api/v1/post_gateways', {}, {
            save: {
                method: 'POST'
            }
        });
}]);