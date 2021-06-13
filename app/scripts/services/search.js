'use strict';
/**
 * @ngdoc service
 * @name abs.search
 * @description
 * # search
 * Factory in the abs.
 */
angular.module('abs')
.factory('Languages', ['$resource', function($resource) {
        return $resource('/api/v1/languages', {}, {
            languageList: {
                method: 'GET'
            }
        });
}])
.factory('Gender', ['$resource', function($resource) {
        return $resource('/api/v1/genders', {}, {
            genderList: {
                method: 'GET'
            }
        });
}])    
.factory('SearchFactory', ['$resource', function($resource) {
        return $resource('/api/v1/users', {}, {
            get: {
                method: 'GET'
            }
        });
}])    
.factory('SearchOthersFactory', ['$resource', function($resource) {
        return $resource('/api/v1/branches', {}, {
            get: {
                method: 'GET'
            }
        });
}]) 
.factory('WeekList', ['$resource', function($resource) {
        return $resource('/api/v1/search/weeklist/:userids/:viewslot', { userids:'@userids', viewslot:'@viewslot'}, {
            get: {
                method: 'GET'
            }
        });
}])  
.factory('ServiceDetails', ['$resource', function($resource) {
        return $resource('/api/v1/service/:id', { id:'@id'}, {
            get: {
                method: 'GET'
            }
        });
}])    
.factory('CategoryService', ['$resource', function($resource) {
        return $resource('/api/v1/category_service/:id', { id:'@id'}, {
            get: {
                method: 'GET'
            }
        });
}]);  