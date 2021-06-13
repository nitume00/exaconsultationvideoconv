'use strict';
/**
 * @ngdoc function
 * @name abs.controller:ContactsController
 * @description
 * # ContactsController
 * Controller of the abs
 */
angular.module('abs.Common.UserFavorites')
    /**
     * @ngdoc directive
     * @name contacts.directive:contactLinks
     * @scope
     * @restrict AE
     *
     * @description
     * contactLink directive creates a contact link. We can use this as an element.
     *
     * @param {string} googleAnalytics Name of the directive
     *
     **/
    .directive('userFavorite', function ($timeout) {
        return {
            restrict: 'E',
            scope: {
                favorite: '@favorite',
                provideruser: '@provideruser',
                clinicuser: '@clinicuser',
                favoritetype: '@favoritetype',
            },
            controller: 'UserFavoriteController',
            templateUrl: 'scripts/plugins/Common/UserFavorites/views/default/favorite.html'
        };
    })
    /**
     * @ngdoc controller
     * @name contacts.controller:ContactUsController
     * @description
     *
     * This is contactUs controller having the methods init(), setMetaData(), and contactFormSubmit().
     *
     * It controls the functionality of contact us.
     **/
    .controller('UserFavoriteController', function ($scope, $http, $filter, $state, $rootScope, $location, $timeout, flash, SweetAlert, UserFavorites, FavoriteDelete, MyUsers) {
        var params = {};
        $scope.index = function () { 
            $rootScope.pageTitle = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("My Doctors");
        };
        $scope.isFavorite = $scope.favorite;
        $scope.favorite_type = $scope.favoritetype;
        $scope.clinic_user_id = $scope.clinicuser;
        $scope.provider_user_id = parseInt($scope.provideruser);
        
        $scope.add_favorite = function (id, clinic_user_id, favorite_type) {
                 var data = {};
                 data.foreign_id = id;
                 if(favorite_type === 'branchFav') {
                    data.class = 'Branch';
                    data.branch_id = id;
                    data.clinic_user_id = clinic_user_id;    
                 } else {
                    data.class = 'User';
                 }   
                 UserFavorites.post(data).$promise.then(function (response) {
                     if(response.error.code === 0){
                            $state.go('my_favorites');
                            flash.set($filter("translate")("Favorite added successfully"), 'success', false);
                        }else{                        
                            flash.set($filter("translate")("Favorite added failed"), 'error', false);
                        }
                });
        };
        $scope.index();
    }); 