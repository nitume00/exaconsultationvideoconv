'use strict';
angular.module('abs')

.directive("appointment", function(ConstUserType) {
  return {
    scope: {
        role: '=role'
    },
    restrict: 'E',
    link: function (scope) {
      //function used on the ng-include to resolve the template
      scope.getAptTemplateUrl = function() {
        //basic handling
        if (parseInt(scope.role) === parseInt(ConstUserType.User)) {
          return "views/patient_appointments.html";
        }
        if (parseInt(scope.role) === parseInt(ConstUserType.Doctor)) {
          return "views/doctor_appointments.html";
        }  
        if (parseInt(scope.role) === parseInt(ConstUserType.Clinic)) {
          return "scripts/plugins/Clinic/Clinic/views/default/clinic_appointments.html";
        }  
        if (parseInt(scope.role) === parseInt(ConstUserType.Diagnostic)) {
          return "scripts/plugins/Clinic/DiagnosticCenter/views/default/diagnostic_labtests.html";
        }  
        if (parseInt(scope.role) === parseInt(ConstUserType.SubAccount)) {
          return "scripts/plugins/Clinic/Clinic/views/default/clinic_appointments.html";
        }  
      };
    },
    template: '<div ng-include src="getAptTemplateUrl()"></div>'
  };
});
