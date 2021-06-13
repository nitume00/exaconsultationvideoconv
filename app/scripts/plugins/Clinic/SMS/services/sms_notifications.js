'use strict'; 
    /**
     * @ngdoc service
     * @name Pages.PageFactory
     * @description
     * PageFactory is used in page listing.
     * @param {string} PageFactory The name of the factory
     * @param {function()} function It returns the url
     */
angular.module('abs')   

.factory('SendSMS', ['$resource', function($resource) {
    return $resource('/api/v1/sms_notifications', {}, {
            get: {
                method: 'GET'
            },
            post: {
                method: 'POST'
            }
        }
    );
}]);