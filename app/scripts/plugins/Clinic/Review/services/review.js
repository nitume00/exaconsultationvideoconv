'use strict';
/**
 * @ngdoc service
 * @name abs.ReviewServicesFactory
 * @description
 * # ReviewServicesFactory
 * Factory in the abs.
 */
angular.module('abs')
.factory('UserReviewsFactory', ['$resource', function($resource) {
    return $resource('/api/v1/reviews/:id', {id: '@id'}, {
        get: {
            method: 'GET'
        } 
      });
}])
.factory('ReviewsFactory', ['$resource', function($resource) {
    return $resource('/api/v1/reviews', {}, {
        get: {
            method: 'GET'
        } 
      });
}])
.factory('ReviewPost', ['$resource', function($resource) {
    return $resource('/api/v1/reviews', {}, {
        post: {
            method: 'POST'
        } 
      });
}]);