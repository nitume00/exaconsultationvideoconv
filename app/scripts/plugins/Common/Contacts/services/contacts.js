'use strict';
	/**
     * @ngdoc service
     * @name contacts.ContactsFactory
     * @description
     * ContactsFactory is a factory service which is used in post a contact form.
     * @param {string} ContactsFactory The name of the factory
     * @param {function()} function It uses post method to save the data
     */
angular.module('abs')

.factory('ContactsFactory', ['$resource', function($resource) {    
    return $resource('/api/v1/contacts', {}, {
            post: {
                method: 'POST'
            }
         });
}]);

 
