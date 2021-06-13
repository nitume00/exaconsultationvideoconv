'use strict';
/**
 * @ngdoc function
 * @name abs.controller:PluginsController
 * @description
 * # PluginsController
PluginsController * Controller of the abs
 */
angular.module('abs')
    .controller('PluginsController', function($scope, $http, notification, $state, $window, $cookies, $timeout) {
        $scope.languageArr = [];
        var enabledPlugin;
        $scope.plugindisabled = false;
        $scope.otherplugins = [];
        function getPluginDetails() {
            $http.get(admin_api_url + 'api/v1/plugins', {}).success(function(response) {
                $timeout(function() {
                    $scope.other_plugin = response.data.other_plugin;
                    $scope.enabled_plugin = response.data.enabled_plugin;
                    angular.forEach($scope.other_plugin, function (value) {
                        angular.forEach(value, function (childvalue) {
                            $scope.otherplugins.push(childvalue);
                        });    
                    });
                    enabledPlugin = response.data.enabled_plugin;
                    $cookies.put('enabled_plugins', JSON.stringify(enabledPlugin), {
                                path: '/'
                    });
                }, 1000);
		    }, function(error){});
        }
        $scope.checkStatus = function(plugin, enabled_plugins) {
            if ($.inArray(plugin, enabled_plugins) > -1) {
                return true;
            } else {
                return false;
            }
        };
        $scope.updatePluginStatus = function(e, plugin_name, status, hash) {
            e.preventDefault();
            var target = angular.element(e.target);
            var checkDisabled = target.parent()
                .hasClass('disabled');
            if (checkDisabled === true) {
                return false;
            }
            if(plugin_name === 'Quote/Quote')
            {
                $scope.plugindisabled = true;
            }
            var params = {};
            var confirm_msg = '';
            var notification_msg = '';
            params.plugin = plugin_name;
            params.is_enabled = status;
            confirm_msg = (status === 0) ? "Are you sure want to disable?" : "Are you sure want to enable?";
            notification_msg = (status === 0) ? "disabled" : "enabled";
            if (confirm(confirm_msg)) {
                $http.put(admin_api_url + 'api/v1/plugins', params)
                    .success(function(response) {
                        if (response.error.code === 0) {
                            var plugin_flash_name = plugin_name.split("/")[1];
                            notification.log(plugin_flash_name + ' Plugin ' + notification_msg + ' successfully.', {
                                addnCls: 'humane-flatty-success'
                            });
                            getPluginDetails();
                        }
                    }, function(error) {});
            }
        };
        $scope.fullRefresh = function() {
            $window.location.reload();
        };
        getPluginDetails();
    });