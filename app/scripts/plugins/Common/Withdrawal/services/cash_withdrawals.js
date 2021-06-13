'use strict';
/**
 * @ngdoc service
 * @name abs.cashWithdrawals
 * @description
 * # cashWithdrawals
 * Factory in the abs.
 */
angular.module('abs.Common.Withdrawal')
    .factory('cashWithdrawals', ['$resource', function($resource) {
        return $resource('/api/v1/users/:user_id/user_cash_withdrawals', {}, {
            get: {
                method: 'GET',
                params: {
                    user_id: '@user_id'
                }
            },
            save: {
                method: 'POST',
                params: {
                    user_id: '@user_id'
                }
            },
        });
  }]);
