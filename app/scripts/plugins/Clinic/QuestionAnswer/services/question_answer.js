'use strict';
/**
 * @ngdoc service
 * @name abs.QuestionAnwersService
 * @description
 * # QuestionAnwersService
 * Factory in the abs.
 */
angular.module('abs')
.factory('QuestionFactory', ['$resource', function($resource) {
            return $resource('/api/v1/questions', {}, {
                get: {
                    method: 'GET'
                },
                post:{
                   method: 'POST'
                }
            });
}])
.factory('QuestionActionsFactory', ['$resource', function($resource) {
            return $resource('/api/v1/questions/:id', {id:'@id'}, {
                get: {
                    method: 'GET'
                },
                put:{
                   method: 'PUT'
                },
                delete: {
                   method: 'DELETE'
                }
            });
}])
.factory('AnswerFactory', ['$resource', function($resource) {
            return $resource('/api/v1/answers', {}, {
                get: {
                    method: 'GET'
                },
                post:{
                   method: 'POST'
                }
            });
}])
.factory('AnswerActionsFactory', ['$resource', function($resource) {
            return $resource('/api/v1/answers/:id', {id:'@id'}, {
                get: {
                    method: 'GET'
                },
                put:{
                   method: 'PUT'
                },
                delete: {
                   method: 'DELETE'
                }
            });
}])
.factory('SpecialtyList', ['$resource', function($resource) {
            return $resource('/api/v1/specialties', {}, {
                get: {
                    method: 'GET'
                } 
            });
}])
.factory('SpecialtyUsers', ['$resource', function($resource) {
            return $resource('/api/v1/specialties_users', {}, {
                get: {
                    method: 'GET'
                } 
            });
}]);

