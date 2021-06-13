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

.factory('MyUsers', ['$resource', function($resource) {
        return $resource('/api/v1/users', {}, {
            get: {
                method: 'GET'
            }
         });
}]) 
.factory('UserFavorites', ['$resource', function($resource) {
    return $resource('/api/v1/user_favorites', {}, {
            get: {
                method: 'GET'
            },
            post: {
                method: 'POST'
            }
        }
    );
}])
.factory('GetUserFavorite', ['$resource', function($resource) {
    return $resource('/api/v1/user_favorites', {id:'@id'}, {
            get: {
                method: 'GET'
            }
        }
    );
}]);
/*.factory('FavoriteDelete', ['$resource', function($resource) {
    return $resource('/api/v1/user_favorites', {id:'@id'}, {
            delete: {
                method: 'DELETE'
            }
        }
    );
}]);*/

