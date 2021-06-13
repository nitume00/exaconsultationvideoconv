'use strict';
/**
 * @ngdoc directive
 * @name abs.directive:RaveByFlutterwave
 * @subscriptionsPlans
 * # subscriptionsPlans
 */
angular.module('abs.Common.RaveByFlutterwave')
.directive('loadSandboxScript', function () {
  return function(scope, element, attrs) {
    angular.element('<script src="https://ravesandboxapi.flutterwave.com/flwv3-pug/getpaidx/api/flwpbf-inline.js"></script>').appendTo(element);
  };
}).directive('loadLiveScript', function () {
  return function(scope, element, attrs) {
    angular.element('<script src="https://api.ravepay.co/flwv3-pug/getpaidx/api/flwpbf-inline.js"></script>').appendTo(element);
  };
});