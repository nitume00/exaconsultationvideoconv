'use strict';
/**
 * @ngdoc directive
 * @name abs.directive:popularSpecialties
 * @description
 * # popularSpecialties
 */
angular.module('abs')
    .directive('popularSpecialties', function(SearchFactory, ConstUserType, md5) {
        return {
            templateUrl: 'views/popular-specialties.html',
            restrict: 'E',
            replace: 'true',
            link: function postLink(scope, element, attrs) {
                //jshint unused:false
                var params = {};
                params.filter = '{"where":{"role_id":'+ ConstUserType.Doctor +',"is_popular":1},"include":{"0": "user_profile","1":"attachment","2":"primary_speciality"},"limit":500,"skip":0}';
                SearchFactory.get(params, function(response) {
                    if (angular.isDefined(response.data)) {
                        var temp_list = [];
                        var i = 0;
                        angular.forEach(response.data, function(speciality) {
                            speciality.user_image = 'images/maledoctor.jpg';
                            if (angular.isDefined(speciality.attachment) && speciality.attachment !== null) {
                               speciality.user_image = 'images/home_thumb/UserAvatar/' + speciality.attachment.id + '.' + md5.createHash('UserAvatar' + speciality.attachment.id + 'png' + 'home_thumb') + '.png';
                            }
                            scope.popular_specialties.push(speciality);
                        });  
                                           
                    }
                });
               
            }
        };
    });