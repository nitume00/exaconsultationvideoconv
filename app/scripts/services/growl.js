'use strict';
/**
 * @ngdoc service
 * @name abs.flash
 * @description
 * # flash
 * Factory in the abs.
 */
angular.module('abs')
    .factory('flash', ['growl', function(growl) {
        return {
            set: function(message, type, isStateChange) {
                //jshint unused:false
                if (type === 'success') {
                    growl.success(message);
                } else if (type === 'error') {
                    growl.error(message);
                } else if (type === 'info') {
                    growl.info(message);
                } else if (type === 'Warning') {
                    growl.warning(message);
                }
            }
        };
    }]);
