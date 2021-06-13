'use strict';
angular.module('abs')

.directive("profile", function(ConstUserType) {
  return {
    scope: {
        role: '=role'
    },
    restrict: 'E',
    link: function (scope) {
      //function used on the ng-include to resolve the template
      scope.getTemplateUrl = function() {
        //basic handling
        if (parseInt(scope.role) === parseInt(ConstUserType.Doctor)) {
          return "views/doctor_profile.html";
        }  
        if (parseInt(scope.role) === parseInt(ConstUserType.Clinic)) {
          return "views/clinic_profile.html";
        }  
        if (parseInt(scope.role) === parseInt(ConstUserType.Diagnostic)) {
          return "views/diagnostic_profile.html";  
        }  
        if (parseInt(scope.role) === parseInt(ConstUserType.Diagnostic)) {
          return "views/diagnostic_profile.html";    
        }  
      };
    },
    template: '<div ng-include src="getTemplateUrl()"></div>',
  };
});