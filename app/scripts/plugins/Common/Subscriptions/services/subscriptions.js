'use strict';
/**
 * @ngdoc service
 * @name adlawApp.QuoteServicesFactory
 * @description
 * # QuoteServicesFactory
 * Factory in the adlawApp.
 */
angular.module('abs')
   .factory('SubscriptionsPlans', ['$resource', function($resource) {
        return $resource('/api/v1/subscriptions', {}, {
            get: {
                method: 'GET'
            }
         });
    }])
   .factory('GetSubscriptionDetail', ['$resource', function($resource) {
        return $resource('/api/v1/subscriptions/:id', {
            id: '@id'
        }, {
            get: {
                method: 'GET'
            },
            put: {
                method: 'PUT'
            }
         });
    }])
    .factory('subscribePayNow', ['$resource', function($resource) {
        return $resource('/api/v1/subscriptions/payment', {}, {
            create: {
                method: 'POST'
            } 
         });
    }])
    .factory('UserSubscriptionFactory', ['$resource', function($resource) {
        return $resource('/api/v1/user_subscriptions', {
        }, {
            post: {
                method: 'POST'
            } 
        });
    }])
    .factory('Countries', ['$resource', function($resource) {
            return $resource('/api/v1/countries', {}, {
                get: {
                    method: 'GET'
                }
            });
   }])
   .factory('MeSubscriptions', ['$resource', function($resource) {
        return $resource('/api/v1/me/subscriptions', {}, {
            get: {
                method: 'GET'
            }
         });
    }])
    .factory('UserSubscriptionsDetail', ['$resource', function($resource) {
        return $resource('/api/v1/users/:id/user_subscription_logs', {}, {
            get: {
                method: 'GET'
            }
         });
    }])
    .factory('UpdateUserSubscriptions', ['$resource', function($resource) {
        return $resource('/api/v1/user_subscriptions/:id', {
            id: '@id'
        }, {
            update: {
                method: 'PUT'
            }
         });
    }])
    .factory('CCCardData', ['$resource', function($resource) {
        return $resource('/api/v1/users/:id', {
            id: '@id'
        }, {
            get: {
                method: 'GET'
            },
            put: {
                method: 'PUT'
            }
         });
    }])
    .factory('UserSubscriptionsPayment', ['$resource', function($resource) {
        return $resource('/api/v1/user_subscriptions', {}, {
            create: {
                method: 'POST'
            } 
         });
    }]).factory('MyUserSubscription', ['$resource', function($resource) {
        return $resource('/api/v1/me/user_subscriptions', {}, {
            get: {
                method: 'GET'
            }
         });
    }]).factory('UpdateUserSubscription', ['$resource', function($resource) {
        return $resource('/api/v1/user_subscriptions/:id/update_status', {
            id: '@id'
        }, {
            put: {
                method: 'PUT'
            }
         });
    }]);