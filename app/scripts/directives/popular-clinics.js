'use strict';
/**
 * @ngdoc directive
 * @name abs.directive:popularClinics
 * @description
 * # popularClinics
 */
angular.module('abs')
    .directive('popularClinics', function(SearchFactory,ConstUserType,md5) {
        return {
            templateUrl: 'views/popular-clinics.html',
            restrict: 'E',
            replace: 'true',
            link: function postLink(scope, element, attrs) {
                //jshint unused:false
                var params = {};
                params.filter = '{"where":{"role_id":'+ ConstUserType.Clinic +',"is_popular":1},"include":{"0": "user_profile","1":"attachment"},"limit":500,"skip":0}';
                scope.popular_clinics = [];
                SearchFactory.get(params, function(response) {
                    if (angular.isDefined(response.data)) {
                        var temp_list = [];
                        var i = 0;
                        angular.forEach(response.data, function(clinic) {
                            clinic.user_image = 'images/maledoctor.jpg';
                            if (angular.isDefined(clinic.attachment) && clinic.attachment !== null) {
                               clinic.user_image = 'images/home_thumb/UserAvatar/' + clinic.attachment.id + '.' + md5.createHash('UserAvatar' + clinic.attachment.id + 'png' + 'home_thumb') + '.png';
                            }
                            scope.popular_clinics.push(clinic);
                        });  
                    }
                });
            }
        };
    });