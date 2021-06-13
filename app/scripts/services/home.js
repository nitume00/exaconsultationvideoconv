'use strict';
/**
 * @ngdoc service
 * @name abs.home
 * @description
 * # cities
 * Factory in the abs.
 */
angular.module('abs')
  .factory('Home', ['$resource', function($resource) {
        return $resource('/api/v1/languages', {}, {
            get: {
                method: 'GET'
            }
        });
  }])
  .factory('Cities', ['$resource', function($resource) {
        return $resource('/api/v1/cities', {}, {
            get: {
                method: 'GET'
            }
        });
  }])
  .factory('States', ['$resource', function($resource) {
        return $resource('/api/v1/states', {}, {
            get: {
                method: 'GET'
            }
        });
  }])
  .factory('Specialties', ['$resource', function($resource) {
        return $resource('/api/v1/specialties', {}, {
            get: {
                method: 'GET'
            }
        });
  }])
  .factory('Insurances', ['$resource', function($resource) {
        return $resource('/api/v1/insurances', {}, {
            get: {
                method: 'GET'
            }
        });
  }]) 
  .factory('Locations', ['$resource', function($resource) {
        return $resource('/api/v1/locations', {}, {
            get: {
                method: 'GET'
            }
        });
  }])    
  .factory('PopularClinics', ['$resource', function($resource) {
        return $resource('/api/v1/users', {}, {
            get: {
                method: 'GET'
            }
        });
  }])
  .factory('Countries', ['$resource', function($resource) {
        return $resource('/api/v1/countries', {}, {
            get: {
                method: 'GET'
            }
        });
  }])
  .factory('CountriesCity', ['$resource', function($resource) {
        return $resource('/api/v1/cities', {}, {
            get: {
                method: 'GET'
            }
        });
  }]);