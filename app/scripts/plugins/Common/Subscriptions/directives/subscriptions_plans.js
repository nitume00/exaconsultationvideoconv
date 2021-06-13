'use strict';
/**
 * @ngdoc directive
 * @name abs.directive:subscriptionsPlans
 * @subscriptionsPlans
 * # subscriptionsPlans
 */
angular.module('abs.Common.Subscriptions')
.directive('subscriptionsPlans', function () {
  var linker = function () {
  };
  return {
      restrict: 'E',
      templateUrl: 'scripts/plugins/Common/Subscriptions/views/default/subscriptions_plans.html',
      link: linker,
      controller: '',
      bindToController: true
  };
});