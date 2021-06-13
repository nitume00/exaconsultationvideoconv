'use strict';
/**
 * @ngdoc service
 * @name abs.UserTransactions
 * @description
 * # UserTransactions
 * Factory in the abs.
 */
angular.module('abs')
    .factory('TransactionsFactory', ['$resource', function($resource) {
        return $resource('/api/v1/users/:id/transactions?&type=:type&from_date=:from&to_date=:to', {}, {
            get: {
                method: 'GET',
				params: {
                    id: '@id',
					type: '@type',
					from: '@from',
					to: '@to'
                }
            }
        });
  }]);