'use strict';
/**
 * @ngdoc directive
 * @name abs.directive:Job
 * @description
 * # JOB
 */
angular.module('abs.Clinic.Clinic')

    .directive('userEducations', function() {
    return {
        restrict: 'E',
        templateUrl: 'scripts/plugins/Clinic/Clinic/views/default/educations.html',
        controller: function($scope) {
            $scope.index = function() {
            // for create view - no userEducations
            $scope.user_educations = []; 
            $scope.usereducation = $scope.user_educations;
            var counter = 0;
                $scope.user_educations = [{
                    education: '',
                    organization: '',
                    location: '',
                    certification_date: new Date()
                }];
            }
            $scope.addUserEducation = function() {
                $scope.user_educations.push({
                    education: '',
                    organization: '',
                    location: '',
                    certification_date: new Date()
                });
            };
            $scope.deleteUserEducation = function(education_id, index) {
                $scope.user_educations.splice(index, 1);
            };
            $scope.index();
        }
    };
    }); 
    