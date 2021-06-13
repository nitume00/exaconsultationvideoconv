var ngapp = angular.module('abs', ['ng-admin', 'ng-admin.jwt-auth', 'http-auth-interceptor', 'angular-md5', 'ngResource', 'ngCookies', 'ngTagsInput']);
var admin_api_url = '/';
var limit_per_page = 20;
var $cookies;
var auth;
var site_settings;
var token;
var enabled_plugins;
angular.injector(['ngCookies'])
    .invoke(['$cookies', function(_$cookies_) {
        $cookies = _$cookies_;
    }]);
ngapp.config(['$httpProvider',
    function($httpProvider) {
        $httpProvider.interceptors.push('interceptor');
        //$httpProvider.interceptors.push('oauthTokenInjector');
        menucollaps();
    }
]);
deferredBootstrapper.bootstrap({
    element: document.body,
    module: 'abs',
    resolve: {
        CmsConfig: function ($http) {
            if (auth !== null && auth !== undefined) {
                token = auth.token;
            }
            var config = {
                headers: {
                    'x-ag-app-id': '4542632501382585',
                    'x-ag-app-secret': '3f7C4l1Y2b0S6a7L8c1E7B3Jo3'
                }
            };
            if (token !== null && token !== undefined) {
                config.headers.Authorization = 'Bearer ' + token;
            }
            return $http.get(admin_api_url + 'api/v1/admin-config', config);
        }
    }
});
// dashboard page redirect changes
function homeController($scope, $http, $location) {
    $location.path('/dashboard');
}
if ($cookies.get('auth') !== undefined && $cookies.get('auth') !== null) {
    auth = JSON.parse($cookies.get('auth'));
}
if ($cookies.get('enabled_plugins') !== undefined && $cookies.get('enabled_plugins') !== null) {
    enabled_plugins = JSON.parse($cookies.get('enabled_plugins'));
}
if ($cookies.get('SETTINGS') !== undefined && $cookies.get('SETTINGS') !== null) {
    site_settings = JSON.parse($cookies.get('SETTINGS'));
} else {
    var site_name = 'ABS';
}
ngapp.constant('user_types', {
    admin: 1,
    user: 2,
    doctor: 3,
    superAdmin: 4,
    clinic: 5,
    hospital: 6,
    diagnostic: 7,
    volunteer: 8,
    subAccount: 9,
    pharmacy: 10
});
ngapp.constant('ConstTransactionType', {
    'AmountAddedToWallet': 1,
    'AdminAddedAmountToUserWallet': 2,
    'AdminDeductedAmountToUserWallet': 3,
    'WithdrawRequested': 4,
    'WithdrawRequestApproved': 5,
    'WithdrawRequestRejected': 6,
    'WithdrawRequestCommission': 7,
    'AppointmentFeePaidToEscrow': 8,
    'AppointmentFeeReleasedToFreelancerWallet': 9,
    'AppointmentFeeRefundedToUser': 10,
    'DiagnosticPayment': 11,
    'SubscriptionPayment': 12
});
ngapp.constant('TransactionAdminMessage', {
    1: '<b>##USER##</b> has added Amount to wallet. Withdraw Request ID: ###FOREIGN_ID##',
    2: 'Site admin added amount to your wallet',
    3: 'Site admin deducted amount from your wallet',
    4: '<b>##USER##</b> has requested withdraw amount from wallet (Initiated)',
    5: 'Approved withdraw request and amount moved to <b>##OTHERUSER##</b> acccount. Withdraw Request ID: ###FOREIGN_ID##',
    6: 'Site admin rejected withdraw request.',
	7: 'Withdrawal fee from ##USER##',
    8: 'Appointment fee paid to escrow for Appointment ID: ###FOREIGN_ID##. </br><b>Patient:</b> ##USER##. <b>Doctor/Clinic Owner:</b> ##OTHERUSER##',
    9: 'Appointment fee released for appointment ID: ###FOREIGN_ID##. </br><b>Patient:</b> ##USER##. <b>Doctor/Clinic Owner:</b> ##OTHERUSER##',
    10: 'Appointment fee refunded for appointment ID: ##FOREIGN_ID##. </br><b>Patient:</b> ##OTHERUSER##. <b>Doctor/Clinic Owner:</b> ##USER##',
    11: 'Fee paid for diagnostic test (ID: ###FOREIGN_ID##) </br><b>Patient:</b> ##USER##. <b>Doctor/Clinic Owner:</b> ##OTHERUSER##',
    12: 'Subscription payment received. </br><b>User:</b> ##USER##. <b>Plan:</b> ##PLAN##', 
});
ngapp.directive('paymentGateways', function (paymentGateway, $state, PaymentGatewaySettings) {
    return {
        restrict: 'E',
        scope: {
            entity: "&",
            entityName: "@",
            entry: "&"
        },
        controller: function($rootScope, $scope, $location, notification) {
            angular.element(document.querySelector('ma-submit-button')
                .remove());
            $scope.test_mode_value = {};
            $scope.live_mode_value = {};
            $scope.liveMode = false;
            $scope.save = function() {
                $scope.data = {};
                $scope.data.live_mode_value = $scope.live_mode_value;
                $scope.data.test_mode_value = $scope.test_mode_value;
                if($scope.liveMode === true) {
                    $scope.data.is_live_mode = true;
                } else {
                    $scope.data.is_live_mode = false;
                }
                $scope.data.id = $scope.entry()
                    .values.id;
                paymentGateway.update($scope.data, function(response) {
                    if (angular.isDefined(response.error.code === 0)) {
                        notification.log('Data updated successfully', {
                            addnCls: 'humane-flatty-success'
                        });
                    }
                });
            };
            $scope.index = function() {
                angular.forEach($scope.entry()
                    .values.payment_settings,
                    function(value, key) {
                        $scope.test_mode_value[value.name] = value.test_mode_value;
                        $scope.live_mode_value[value.name] = value.live_mode_value;
                    });
                    if(parseInt($state.params.id) === PaymentGatewaySettings.PayPalREST) {
                        $scope.PayPalREST = true;
                    } else {
                        $scope.PayPalREST = false;
                    }
                    if(parseInt($state.params.id) === PaymentGatewaySettings.Wallet) {
                        $scope.wallet = true;
                    } else {
                         $scope.wallet = false;
                    }
                    if(parseInt($state.params.id) === PaymentGatewaySettings.RaveByFlutterwave) {
                        $scope.RaveByFlutterwave = true;
                    } else {
                        $scope.RaveByFlutterwave = false;
                    }
                    $scope.liveMode = true;
                    if($scope.entry().values.is_test_mode === 1) {
                        $scope.liveMode = false;
                    }
            };
            $scope.index();
        },
        template: '<span ng-show="!wallet"><input type="checkbox" ng-model="liveMode"></span>&nbsp;<span ng-if="!wallet">Live Mode?</span><table ng-show="RaveByFlutterwave"><tr><th></th><th>Live Mode Credential</th><th>&nbsp;</th><th>Test Mode Credential</th></tr><tr><td>Public Key &nbsp;&nbsp;</td><td><input type="text" ng-model="live_mode_value.public_key" class="form-control"></td><td>&nbsp;</td><td><input type="text" class="form-control" ng-readonly="live_mode" ng-model="test_mode_value.public_key"></td></tr><tr><td>Public Key</td><td><input type="text" class="form-control" ng-model="live_mode_value.public_key"></td><td>&nbsp;</td><td><input type="text" class="form-control" ng-readonly="live_mode" ng-model="test_mode_value.public_key"></td></tr><tr><td>Webhook Secret Hash</td><td><input type="text" class="form-control" ng-model="live_mode_value.webhook_secret_hash"></td><td>&nbsp;</td><td><input type="text" class="form-control" ng-readonly="live_mode" ng-model="test_mode_value.webhook_secret_hash"></td></tr><tr><td>&nbsp;</td><td><button type="button" ng-click="save()" class="btn btn-primary"><span class="glyphicon glyphicon-ok"></span>&nbsp;<span class="hidden-xs">Save changes</span></button></td><td>&nbsp;</td><td></td></tr></table>',
    };
});
ngapp.provider('googleMapServices', function() {
    this.$get = function() {
        return {
            googleMapProviderFunction: function() {
                return "API_KEY";
            }
        }
    };
})
.config(function(googleMapServicesProvider){
    $.get('/api/v1/get_google_map_api', function(response) {
        if(response && response.data && response.data.value) {
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'https://maps.googleapis.com/maps/api/js?libraries=places&key='+response.data.value;
            document.body.appendChild(script);
        }
    });
});
ngapp.constant('PaymentGatewaySettings', {
    'PayPal': 2,
    'RaveByFlutterwave': 3,

});
ngapp.constant('ConstSecuritySalt', {
    'SECURITY_SALT': 'e9a556134534545ab47c6c81c14f06c0b8sdfsdf'
});
function truncate(value) {
    if (!value) {
        return '';
    }
    return value.length > 50 ? value.substr(0, 50) + '...' : value;
}

function withdrawn(value, entry) {
    if (!entry) {
        return '';
    }
    return entry.amount - entry.withdrawal_fee;
}

function statusdisplay(value) {
    if (value == true) {
        return '<span class="glyphicon glyphicon-ok"></span>';
    }
    return '';
}

function covertstringtonumber(value) {
    return parseFloat(value);
}
ngapp.config(function($stateProvider) {
    var getToken = {
        'TokenServiceData': function(adminTokenService, $q) {
            return $q.all({
                SettingServiceData: adminTokenService.promiseSettings
            });
        }
    };
    $stateProvider.state('change_password', {
            parent: 'main',
            url: '/change_password',
            templateUrl: 'views/change_password.html',
            params: {
                id: null
            },
            controller: 'ChangePasswordController',
            resolve: getToken
        }).state('userlogout', {
            url: '/users/logout',
            controller: 'UsersLogoutCtrl',
            resolve: getToken
        }).state('home', {
            parent: 'main',
            url: '/',
            controller: homeController,
            controllerAs: 'controller',
            resolve: getToken
        }).state('plugins', {
            parent: 'main',
            url: '/plugins',
			templateUrl: 'views/plugins.html',
            controller: 'PluginsController',
            resolve: getToken
        }).state('translations', {
            parent: 'main',
            url: '/translations/all',
            controller: 'TranslationsController',
            templateUrl: 'views/translations.html',
            resolve: getToken
        }).state('translation_edit', {
            parent: 'main',
            url: '/translations?lang_code',
            controller: 'TranslationsController',
            templateUrl: 'views/translation_edit.html',
            resolve: getToken
        })
        .state('translation_add', {
            parent: 'main',
            url: '/translations/add',
            controller: 'TranslationsController',
            templateUrl: 'views/make_new_translation.html',
            resolve: getToken
        })
        .state('verify_user_account', {
            parent: 'main',
            url: '/verify_user_account/:id',
            templateUrl: 'views/verify_user_account.html',
            params: {
                id: null
            },
            controller: 'UserVerifyController',
            resolve: getToken
        })
        .state('pay_offline', {
            parent: 'main',
            url: '/pay_offline/:id',
            templateUrl: 'views/pay_offline.html',
            params: {
                id: null
            },
            controller: 'PaymentCtrl',
            resolve: getToken
        })
        .state('translation_add_text', {
            parent: 'main',
            url: '/translations/add_text',
            controller: 'TranslationsController',
            templateUrl: 'views/make_new_text_translation.html',
            resolve: getToken
        })
        .state('prescription_view', {
            parent: 'main',
            url: '/prescriptions/show/:id/:token',
            controller: 'PrescriptionCtrl',
            templateUrl: 'views/prescription_view.html',
            resolve: getToken
        })
        .state('pharmacy_view', {
            parent: 'main',
            url: '/pharmacy',
            controller: 'PharmacyCtrl',
            templateUrl: 'views/pharmacy_view.html',
            resolve: getToken
        })
        .state('pharmacy_profile', {
            parent: 'main',
            url: '/pharmacy/edit_profile',
            controller: 'PharmacyCtrl',
            templateUrl: 'views/pharmacy_profile.html',
            resolve: getToken
        })
        .state('stocks', {
            parent: 'main',
            url: '/stocks/all',
            controller: 'StockController',
            templateUrl: 'views/stocks.html',
            resolve: getToken
        })
        .state('import_csv', {
            parent: 'main',
            url: '/medicines/import_csv',
            controller: 'PrescriptionCtrl',
            templateUrl: 'views/import_medicines.html',
            resolve: getToken
        })
        .state('transactions', {
            parent: 'main',
            url: '/transactions/all',
            controller: 'TransactionController',
            templateUrl: 'views/transaction.html',
            resolve: getToken
        })
});



ngapp.directive('starRating', function() {
    return {
        restrict: 'E',
        scope: {
            stars: '@'
        },
        link: function(scope, elm, attrs, ctrl) {
            scope.starsArray = Array.apply(null, {
                    length: parseInt(scope.stars)
                })
                .map(Number.call, Number);
        },
        template: '<i ng-repeat="star in starsArray" class="glyphicon glyphicon-star"></i>'
    };
});
//custom header  controller defined here.
function customHeaderController($state, $scope, $http, $location, notification) {
    if ($cookies.get('auth') !== undefined && $cookies.get('auth') !== null) {
        auth = JSON.parse($cookies.get('auth'));
        $scope.adminDetail = auth;
        $http.get(admin_api_url + 'api/v1/prescriptions/notify')
                .success(function(response) {
                    $scope.prescription_count = response.prescription_count;
                });
    }else if(auth !== undefined){
            $scope.adminDetail = auth;
    }
}
ngapp.directive('customHeader', ['$location', '$state', '$http', function ($location, $state, $http, $scope) {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: '../ag-admin/views/custom_header.html',
        link: function (scope) {
            scope.siteUrl = admin_api_url;
            scope.auth = auth;
            if(scope.auth.role_id === 1) {
                scope.header_panel = 'Admin';
            } else if (scope.auth.role_id === 4) {
                scope.header_panel = 'Sub Admin';
            } else if (scope.auth.role_id === 10) {
                scope.header_panel = 'Pharmacy';
            }
        },
		controller: customHeaderController,
            controllerAs: 'controller',
            resolve: {}
    };
}]);
ngapp.directive('googlePlaces', ['$location', function($location) {
    return {
        restrict: 'E',
        scope: {
            entity: "&",
            entityName: "@",
            entry: "&",
            size: "@",
            label: "@"
        },
        link: function(scope) {
            var inputFrom = document.getElementById('goo-place');
            var autocompleteFrom = new google.maps.places.Autocomplete(inputFrom);
            google.maps.event.addListener(autocompleteFrom, 'place_changed', function() {
                scope.entry()
                    .values['city.name'] = '';
                scope.entry()
                    .values['address'] = '';
                scope.entry()
                    .values['address1'] = '';
                scope.entry()
                    .values['state.name'] = '';
                scope.entry()
                    .values['country.iso2'] = '';
                scope.entry()
                    .values['zip_code'] = '';
                var place = autocompleteFrom.getPlace();
                scope.entry()
                    .values.latitude = place.geometry.location.lat();
                scope.entry()
                    .values.longitude = place.geometry.location.lng();
                scope.entry()
                    .values.address_latitude = place.geometry.location.lat();
                scope.entry()
                    .values.address_longitude = place.geometry.location.lng();
                scope.entry()
                    .values.location = place.formatted_address;                    
                scope.entry()
                    .values.full_address = place.formatted_address;
                scope.entry()
                    .values.address = place.formatted_address;                    
                var k = 0;
                angular.forEach(place.address_components, function(value, key) {
                    //jshint unused:false
                    if (value.types[0] === 'locality' || value.types[0] === 'administrative_area_level_2') {
                        if (k === 0) {
                            scope.entry()
                                .values['city.name'] = value.long_name;
                            document.getElementById("city.name")
                                .disabled = true;
                        }
                        if (value.types[0] === 'locality') {
                            k = 1;
                        }
                    }
                    if (value.types[0] === 'sublocality_level_1' || value.types[0] === 'sublocality_level_2') {
                        if (scope.entry()
                            .values['address1'] !== '') {
                            scope.entry()
                                .values['address1'] = scope.entry()
                                .values['address1'] + ',' + value.long_name;
                        } else {
                            scope.entry()
                                .values['address1'] = value.long_name;
                        }
                    }
                    if (value.types[0] === 'administrative_area_level_1') {
                        scope.entry()
                            .values['state.name'] = value.long_name;
                        document.getElementById("state.name")
                            .disabled = true;
                    }
                    if (value.types[0] === 'country') {
                        scope.entry()
                            .values['country.iso2'] = value.short_name;
                        document.getElementById("country.iso2s")
                            .disabled = true;
                    }
                    if (value.types[0] === 'postal_code') {
                        scope.entry()
                            .values.zip_code = parseInt(value.long_name);
                        document.getElementById("zip_code")
                            .disabled = true;
                    }
                });
                scope.$apply();
            });
        },
        template: '<input class="form-control" id="goo-place"/>'
    };
}]);
ngapp.directive('changePassword', ['$location', '$state', '$http', 'notification', function($location, $state, $http, notification) {
    return {
        restrict: 'E',
        scope: {
            entity: "&",
            entityName: "@",
            entry: "&",
            size: "@",
            label: "@"
        },
        template: '<a class=\"btn btn-default btn-xs\" title="Change Password" ng-click=\"password()\" >\n<span class=\"glyphicon glyphicon-lock sync-icon\" aria-hidden=\"true\"></span>&nbsp;<span class=\"sync hidden-xs\"> {{label}}</span> <span ng-show=\"disableButton\"><i class=\"fa fa-spinner fa-pulse fa-lg\"></i></span>\n</a>',
        link: function(scope, element) {
            var id = scope.entry()
                .values.id;
            scope.password = function() {
                $state.go('change_password', {
                    id: id
                });
            };
        }
    };
}]);
ngapp.directive('displayImage', function(md5) {
    return {
        restrict: 'E',
        scope: {
            entity: "&",
            entry: "&"
        },
        link: function(scope, elem, attrs) {
            scope.type = attrs.type;
            scope.thumb = attrs.thumb;
            if (angular.isDefined(scope.entry()
                    .values['attachment.foreign_id']) && scope.entry()
                .values['attachment.foreign_id'] !== null && scope.entry()
                .values['attachment.foreign_id'] !== 0) {
                var hash = md5.createHash(scope.type + scope.entry()
                    .values.id + 'png' + scope.thumb);
                scope.image = '/images/' + scope.thumb + '/' + scope.type + '/' + scope.entry()
                    .values.id + '.' + hash + '.png';
            } else {
                scope.image = '../images/no-image.png';
            }
        },
        template: '<img ng-src="{{image}}" height="42" width="42" />'
    };
});

ngapp.directive('displayImages', function(md5) {
    return {
        restrict: 'E',
        scope: {
            entity: "&",
            entry: "&"
        },
        link: function(scope, elem, attrs) {
            scope.type = attrs.type;
            scope.thumb = attrs.thumb;
            if (angular.isDefined(scope.entry()
                    .values['attachment'][0]['foreign_id']) && scope.entry()
                .values['attachment'][0]['foreign_id'] !== null && scope.entry()
                .values['attachment'][0]['foreign_id'] !== 0) {
                var hash = md5.createHash(scope.type + scope.entry()
                    .values.id + 'png' + scope.thumb);
                scope.image = '/images/' + scope.thumb + '/' + scope.type + '/' + scope.entry()
                    .values.id + '.' + hash + '.png';
            } else {
                scope.image = '../images/no-image.png';
            }
        },
        template: '<img ng-src="{{image}}" height="42" width="42" />'
    };
});
ngapp.directive('fileDownload', function (md5, $location, $timeout) {
    var directive = {
        restrict: 'EA',
        //replace: true,
        template: '<a href="{{downloadUrl}}" class="cursor" target="_blank"> <span ng-bind-html="downloadlable"></span> </a>',
        scope: {
            attachment: '@',
            downloadlable: '@'
        },
        link: function (scope) {
             $timeout(function(){
                scope.attachment = JSON.parse(scope.attachment);
                var ext = scope.attachment.filename.substr(scope.attachment.filename.lastIndexOf('.')+1).toLowerCase();  
                var download_file = md5.createHash(scope.attachment.class + scope.attachment.id + ext + 'download');
                scope.downloadUrl = $location.protocol() + '://' + $location.host() + '/download/' + scope.attachment.class + '/' + scope.attachment.id + '/' + download_file + '.'+ext;
                scope.downloadlable = '<i class="fa fa-download fa-2x"> </i>' +' '+download_file+ '.'+ext;
                /* For check the download label is undeifed or not to fill the default text */
                if (scope.downloadlable === undefined) {
                    scope.downloadlable = '<i class="fa fa-download fa-2x"> </i>' + ' '+download_file+ '.'+ext;
                } 
           },500);    
        },
    };
    return directive;
});
ngapp.directive('downloadFile', function (md5,$location) {
    return {
        restrict: 'E',
        scope: {
            entity: "&",
            entry: "&"
        },
        controller: function ($http, $scope, $rootScope) {
            var model = this;
            var that = this;
            var service_id;
            var params = {};
            $scope.attachment = $scope.entry().values;
            
            $scope.check_attachment = $scope.entry().values.attachment;
            if($scope.attachment.attachment[0]){
                var checking_value = $scope.attachment.attachment[0].filename.split('.').pop();
            }
                if (angular.isDefined($scope.attachment.attachment[0]) && $scope.attachment.attachment !== null) {
                var download_file = md5.createHash($scope.attachment.attachment[0].class + $scope.attachment.attachment[0].id + checking_value + 'download') + '.' + checking_value;

        $scope.user_image = $location.protocol() + '://' + $location.host() + '/download/' + $scope.attachment.attachment[0].class + '/' + $scope.attachment.attachment[0].id + '/' + download_file;    
        }else{
                $scope.user_image = undefined;
            }  
        },
        template: '<span ng-show="user_image !== undefined"><a ng-href="{{user_image}}" download><button type="button">{{"Download"|translate}}</button></a></span>'
    };
});
ngapp.directive('idProofDownload', ['$location', '$state', '$http', 'notification', function($location, $state, $http, notification) {
    return {
        restrict: 'E',
        scope: {
            entity: "&",
            entityName: "@",
            entry: "&",
            size: "@",
            label: "@"
        },
        template: '<a class=\"btn btn-default\" title="Review Documents" ng-click=\"idAddressProof()\" >\n&nbsp;<span class=\"sync hidden-xs\"> <i class=\"glyphicon glyphicon-lock sync-icon\" aria-hidden=\"true\"></i> {{label}}</span>\n</a>',
        link: function(scope) {
            var id = scope.entry()
                .values.id;
            scope.idAddressProof = function() {
                $state.go('verify_user_account', {
                    id: id
                });
            };
        }
    };
}]);

ngapp.directive('offlinePay', ['$location', '$state', '$http', 'notification', function($location, $state, $http, notification) {
    return {
        restrict: 'E',
        scope: {
            entity: "&",
            entityName: "@",
            entry: "&",
            size: "@",
            label: "@"
        },
        template: '<a class=\"btn btn-default\" title="Pay" ng-click=\"payOffline()\" >\n&nbsp;<span class=\"sync hidden-xs\"> <i class=\"glyphicon glyphicon-lock sync-icon\" aria-hidden=\"true\"></i> {{label}}</span>\n</a>',
        link: function(scope) {
            var id = scope.entry()
                .values.id;
            scope.payOffline = function() {
                $state.go('pay_offline', {
                    id: id
                });
            };
        }
    };
}]);

ngapp.directive('batchActive', ['$location', '$state', 'notification', '$q', 'Restangular', function($location, $state, notification, $q, Restangular) {
    return {
        restrict: 'E',
        scope: {
            selection: '=',
            type: '@',
            action: '@'
        },
        link: function(scope, element, attrs) {
            const status_name = attrs.type == 'active' ? 'Active' : 'Active';
            scope.icon = attrs.type == 'active' ? 'glyphicon-ok' : 'glyphicon-ok';
            scope.label = attrs.type == 'active' ? 'Active' : 'Active';
            scope.action = attrs.action;
            scope.updateStatus = function(action) {
                $q.all(scope.selection.map(function(e) {
                        var p = Restangular.one('/' + action + '/' + e.values.id);
                        p.is_active = 1;
                        p.put()
                            .then(function() {
                                $state.reload()
                            })
                    }))
                    .then(function() {
                        notification.log(scope.selection.length + ' status changed to  ' + status_name, {
                            addnCls: 'humane-flatty-success'
                        });
                    })
            }
        },
        template: '<span ng-click="updateStatus(action)"><span class="glyphicon {{ icon }}" aria-hidden="true"></span>&nbsp;{{ label }}</span>'
    };
}]);
ngapp.directive('batchInActive', ['$location', '$state', 'notification', '$q', 'Restangular', function($location, $state, notification, $q, Restangular) {
    return {
        restrict: 'E',
        scope: {
            selection: '=',
            type: '@',
            action: '@'
        },
        link: function(scope, element, attrs) {
            const status_name = attrs.type == 'active' ? 'Inactive' : 'Inactive';
            scope.icon = attrs.type == 'active' ? 'glyphicon-remove' : 'glyphicon-remove';
            scope.label = attrs.type == 'active' ? 'Inactive' : 'Inactive';
            scope.action = attrs.action;
            scope.updateStatus = function(action) {
                $q.all(scope.selection.map(function(e) {
                        var p = Restangular.one('/' + action + '/' + e.values.id);
                        p.is_active = 0;
                        p.put()
                            .then(function() {
                                $state.reload()
                            })
                    }))
                    .then(function() {
                        notification.log(scope.selection.length + ' status changed to  ' + status_name, {
                            addnCls: 'humane-flatty-success'
                        });
                    })
            }
        },
        template: '<span ng-click="updateStatus(action)"><span class="glyphicon {{ icon }}" aria-hidden="true"></span>&nbsp;{{ label }}</span>'
    };
}]);

ngapp.directive('batchAdminsuspend', ['$location', '$state', 'notification', '$q', 'Restangular', function($location, $state, notification, $q, Restangular) {
    return {
        restrict: 'E',
        scope: {
            selection: '=',
            type: '@',
            action: '@'
        },
        link: function(scope, element, attrs) {
            const status_name = attrs.type == 'suspend' ? 'Mark as Suspend' : 'Mark as Suspend';
            scope.icon = attrs.type == 'suspend' ? 'glyphicon-ok' : 'glyphicon-ok';
            scope.label = attrs.type == 'suspend' ? 'Mark as Suspend' : 'Mark as Suspend';
            scope.action = attrs.action;
            scope.updateStatus = function(action) {
                $q.all(scope.selection.map(function(e) {
                        var p = Restangular.one('/' + action + '/' + e.values.id);
                        p.is_admin_suspend = 1;
                        p.put()
                            .then(function() {
                                $state.reload()
                            })
                    }))
                    .then(function() {
                        notification.log(scope.selection.length + ' status changed to  ' + status_name, {
                            addnCls: 'humane-flatty-success'
                        });
                    })
            }
        },
        template: '<span ng-click="updateStatus(action)"><span class="glyphicon {{ icon }}" aria-hidden="true"></span>&nbsp;{{ label }}</span>'
    };
}]);
ngapp.directive('batchAdminunsuspend', ['$location', '$state', 'notification', '$q', 'Restangular', function($location, $state, notification, $q, Restangular) {
    return {
        restrict: 'E',
        scope: {
            selection: '=',
            type: '@',
            action: '@'
        },
        link: function(scope, element, attrs) {
            const status_name = attrs.type == 'unsuspend' ? 'Mark as Unsuspend' : 'Mark as Unsuspend';
            scope.icon = attrs.type == 'unsuspend' ? 'glyphicon-remove' : 'glyphicon-remove';
            scope.label = attrs.type == 'unsuspend' ? 'Mark as Unsuspend' : 'Mark as Unsuspend';
            scope.action = attrs.action;
            scope.updateStatus = function(action) {
                $q.all(scope.selection.map(function(e) {
                        var p = Restangular.one('/' + action + '/' + e.values.id);
                        p.is_admin_suspend = 0;
                        p.put()
                            .then(function() {
                                $state.reload()
                            })
                    }))
                    .then(function() {
                        notification.log(scope.selection.length + ' status changed to  ' + status_name, {
                            addnCls: 'humane-flatty-success'
                        });
                    })
            }
        },
        template: '<span ng-click="updateStatus(action)"><span class="glyphicon {{ icon }}" aria-hidden="true"></span>&nbsp;{{ label }}</span>'
    };
}]);
ngapp.directive('batchAdminactive', ['$location', '$state', 'notification', '$q', 'Restangular', function($location, $state, notification, $q, Restangular) {
    return {
        restrict: 'E',
        scope: {
            selection: '=',
            type: '@',
            action: '@'
        },
        link: function(scope, element, attrs) {
            const status_name = attrs.type == 'active' ? 'Mark as Active' : 'Mark as Active';
            scope.icon = attrs.type == 'active' ? 'glyphicon-remove' : 'glyphicon-remove';
            scope.label = attrs.type == 'active' ? 'Mark as Active' : 'Mark as Active';
            scope.action = attrs.action;
            scope.updateStatus = function(action) {
                $q.all(scope.selection.map(function(e) {
                        var p = Restangular.one('/' + action + '/' + e.values.id);
                        p.is_active = 1;
                        p.put()
                            .then(function() {
                                $state.reload()
                            })
                    }))
                    .then(function() {
                        notification.log(scope.selection.length + ' status changed to  ' + status_name, {
                            addnCls: 'humane-flatty-success'
                        });
                    })
            }
        },
        template: '<span ng-click="updateStatus(action)"><span class="glyphicon {{ icon }}" aria-hidden="true"></span>&nbsp;{{ label }}</span>'
    };
}]);
ngapp.directive('batchAdmininactive', ['$location', '$state', 'notification', '$q', 'Restangular', function($location, $state, notification, $q, Restangular) {
    return {
        restrict: 'E',
        scope: {
            selection: '=',
            type: '@',
            action: '@'
        },
        link: function(scope, element, attrs) {
            const status_name = attrs.type == 'inactive' ? 'Mark as Inactive' : 'Mark as Inactive';
            scope.icon = attrs.type == 'inactive' ? 'glyphicon-remove' : 'glyphicon-remove';
            scope.label = attrs.type == 'inactive' ? 'Mark as Inactive' : 'Mark as Inactive';
            scope.action = attrs.action;
            scope.updateStatus = function(action) {
                $q.all(scope.selection.map(function(e) {
                        var p = Restangular.one('/' + action + '/' + e.values.id);
                        p.is_active = 0;
                        p.put()
                            .then(function() {
                                $state.reload()
                            })
                    }))
                    .then(function() {
                        notification.log(scope.selection.length + ' status changed to  ' + status_name, {
                            addnCls: 'humane-flatty-success'
                        });
                    })
            }
        },
        template: '<span ng-click="updateStatus(action)"><span class="glyphicon {{ icon }}" aria-hidden="true"></span>&nbsp;{{ label }}</span>'
    };
}]);
ngapp.directive('changeStatues', ['$location', '$state', 'notification', '$q', 'Restangular', function($location, $state, notification, $q, Restangular) {
    return {
        restrict: 'E',
        scope: {
            type: '@',
            action: '@',
            id: '@',
            status: '@'
        },
        link: function(scope, element, attrs) {
            scope.label = attrs.type;
            scope.action = attrs.action;
            scope.id = attrs.id;
            scope.status = attrs.status;
            scope.updateMyStatus = function(action, id, status) {
                var p = Restangular.one('/' + action + '/' + id);
                p.contest_status_id = status;
                p.put()
                    .then(function() {
                        notification.log(' status changed to  ' + scope.label, {
                            addnCls: 'humane-flatty-success'
                        });
                        $state.reload()
                    })
            }
        },
        template: '<span class="label label-primary" ng-click="updateMyStatus(action,id,status)">&nbsp;{{ label }}</span>'
    };
}]);
ngapp.directive('formFields', [function() {
    return {
        restrict: 'E',
        scope: {
            entry: "&"
        },
        link: function(scope, element, attrs) {
            scope.myformfields = scope.entry()
                .id;
        },
        template: '<ul><li ng-repeat="formdata in myformfields"><h5><strong>{{formdata.form_field[0].label}}<strong></h5><p>{{formdata.response}}</p></li></ul>'
        };
}]);
ngapp.directive('batchEmailConfirm', ['$location', '$state', 'notification', '$q', 'Restangular', function($location, $state, notification, $q, Restangular) {
    return {
        restrict: 'E',
        scope: {
            selection: '=',
            type: '@',
            action: '@'
        },
        link: function(scope, element, attrs) {
            const status_name = attrs.type == 'active' ? 'Email Confirmed' : 'Email Confirmed';
            scope.icon = attrs.type == 'active' ? 'glyphicon-ok' : 'glyphicon-ok';
            scope.label = attrs.type == 'active' ? 'Email Confirmed' : 'Email Confirmed';
            scope.action = attrs.action;
            scope.updateStatus = function(action) {
                $q.all(scope.selection.map(function(e) {
                        var p = Restangular.one('/' + action + '/' + e.values.id);
                        p.is_email_confirmed = 1;
                        p.put()
                            .then(function() {
                                $state.reload()
                            })
                    }))
                    .then(function() {
                        notification.log(scope.selection.length + ' status changed to  ' + status_name, {
                            addnCls: 'humane-flatty-success'
                        });
                    })
            }
        },
        template: '<span ng-click="updateStatus(action)"><span class="glyphicon {{ icon }}" aria-hidden="true"></span>&nbsp;{{ label }}</span>'
    };
}]);
ngapp.directive('inputType', function() {
    return {
        restrict: 'E',
        scope: {
            entity: "&",
            entry: "&"
        },
        link: function(scope, elem, attrs) {
            elem.bind('change', function() {
                scope.$apply(function() {
                    scope.entry()
                        .values.value = scope.value;
                    if (scope.entry()
                        .values.type === 'checkbox') {
                        scope.entry()
                            .values.value = scope.value ? 1 : 0;
                    }
                    if (scope.entry()
                        .values.type === 'select') {
                        scope.entry()
                            .values.value = scope.value;
                    }
                });
            });
        },
        controller: function($scope) {
            $scope.text = 1;
            $scope.value = $scope.entry()
                .values.value;
            if ($scope.entry()
                .values.type === 'checkbox') {
                $scope.text = 2;
                $scope.value = Number($scope.value);
            }
            else if ($scope.entry()
                .values.type === 'select') {
                $scope.text = 3;
                $scope.option_values = $scope.entry()
                .values.option_values.split(",");
            }
        },
        template: '<textarea ng-model="$parent.value" id="value" name="value" class="form-control" ng-if="text==1"></textarea><input type="checkbox" ng-model="$parent.value" id="value" name="value" ng-if="text==2" ng-true-value="1" ng-false-value="0" ng-checked="$parent.value == 1"/><select ng-if="text==3" ng-model="$parent.value" name="value" class="form-control" ng-options="option_value for option_value in option_values"></select>'
    };
});
ngapp.directive('dashboardSummary', ['$location', '$state', '$http', '$rootScope', function($location, $state, $http, $rootScope) {
    return {
        restrict: 'E',
        scope: {
            entity: "&",
            entityName: "@",
            entry: "&",
            size: "@",
            label: "@",
            revenueDetails: "&"
        },
        templateUrl: 'views/dashboardSummary.html',
        link: function(scope) {
            /* $http.get(admin_api_url + 'api/v1/plugins', {})
                .success(function(response) {
                    scope.enabled_plugin = response.data.enabled_plugin;
                    $cookies.put('enabled_plugins', JSON.stringify(scope.enabled_plugin), {
                        path: '/'
                    });
                }, function(error) {}); */
            $http.get(admin_api_url + 'api/v1/stats')
                .success(function(response) {
                    scope.adminstats = response;
                    scope.enabled_plugins = $rootScope.enabled_plugins;
                    if ($cookies.get('auth') !== undefined && $cookies.get('auth') !== null) {
                        auth = JSON.parse($cookies.get('auth'));
                        if(auth.role_id === 10) {
                            scope.dashboard_enabled = 0;
                        } else if (auth.role_id === 1) {
                            scope.dashboard_enabled = 1;
                        } 
                    }    
                });
        }
    };
}]);
ngapp.directive('medicinesCsv', ['$location', '$state', function ($location, $state, $http) {
    return {
      restrict: 'E',
      scope: {
        entity: "&",
        entityName: "@",
        entry: "&",
        size: "@",
        label: "@"
      },
      template: '<a href="#/medicines/import_csv" class="btn btn-success" ng-class="size ? \'btn-\' + size : \'\'">\n<i class="ti-plus" aria-hidden="true"></i>&nbsp;<span class="hidden-xs">Import Medicine (CSV)</span>\n</a>',
      controller: function ($scope, $http) {
  
      }
    };
  }]);  
ngapp.directive('prescriptionDownload', ['$location', '$state', '$http', 'notification','md5', 'ConstSecuritySalt', function($location, $state, $http, notification, md5, ConstSecuritySalt) {
    return {
        restrict: 'E',
        scope: {
            entity: "&",
            entityName: "@",
            entry: "&",
            size: "@",
            label: "@"
        },
        link: function(scope) {
            var id = scope.entry()
                .values.id;
                scope.appointment_token = scope.entry().values["appointment.appointment_token"];    
                scope.pres_url = window.location.protocol +'//' + window.location.host + '/prescription/pdf/'+ scope.entry().values.id + '/' + md5.createHash(scope.entry().values.id+'pdf'+ConstSecuritySalt.SECURITY_SALT);
        },
        template: '<a href="{{pres_url}}" class=\"btn btn-info\" title="Download" target="_blank">\n&nbsp;<span class=\"sync hidden-xs\"> <i class=\"glyphicon glyphicon-download sync-icon\" aria-hidden=\"true\"></i> {{appointment_token}}</span>\n</a>',
    };
}]);
ngapp.directive('prescriptionShow', ['$location', '$state', function($location, $state) {
    return {
        restrict: 'E',
        scope: {
            entity: "&",
            entityName: "@",
            entry: "&",
            size: "@",
            label: "@"
        }, 
        link: function(scope) {
            scope.status_id = scope.entry().values.is_delivered;
            scope.is_active = scope.entry().values.is_active;
            scope.pres_url = window.location.protocol +'//' + window.location.host + '/ag-admin/#/prescriptions/show/' + scope.entry()
            .values.id + '/' + scope.entry().values["appointment.appointment_token"];
            scope.is_delivered_via = scope.entry().values['user.user_profile.is_prescription_delivered_via'];
        },
        template: '<a href="{{pres_url}}" class=\"btn btn-success\" title="View" ng-if="status_id == 0 && is_delivered_via ==1 && is_active ==1">\n&nbsp;<span class=\"sync hidden-xs\"> <i class=\"glyphicon glyphicon-check sync-icon\" aria-hidden=\"true\"></i> Accept</span>\n</a> <a href="{{pres_url}}" class=\"btn btn-success btn-sm\" title="View" ng-if="status_id == 1 && is_delivered_via ==1">\n&nbsp;<span class=\"sync hidden-xs\"> <i class=\"glyphicon glyphicon-check sync-icon\" aria-hidden=\"true\"></i> Delivered</span>\n</a> <a href="" class=\"btn btn-info btn-sm\" title="View" ng-if="is_delivered_via ==0">\n&nbsp;<span class=\"sync hidden-xs\">  Patient wants the prescription to be supplied by other</span>\n</a>',
    };
}]);
ngapp.directive('prescriptionExpire', function (md5,$location) {
    return {
        restrict: 'E',
        scope: true,
        controller: function ($http, $scope, $rootScope, PrescriptionAction, notification) {
            params = {};
            $scope.status_id = $scope.entry.values.is_active;
            $scope.UpdateStatus = function(){
                params.id = $scope.entry.values.id;
                params.is_active = 0;
                PrescriptionAction.put(params, function(response){
                    if(response.error.code === 0){
                        notification.log('Status changed successfully', {
                            addnCls: 'humane-flatty-success'
                        });
                        $scope.status_id = $scope.entry.values.is_active= response.data.is_active;
                    }
                });    
            }; 
        },
        template: '<a  class=\"btn btn-danger btn-sm\" ng-click="UpdateStatus()" ng-if="status_id == 1"><i class=\"glyphicon glyphicon-time sync-icon\" aria-hidden=\"true\"></i>Expire</a><span ng-if="status_id == 0">Expired</span>'
    };
});

ngapp.directive('pharmacyView', ['$location', '$state', function($location, $state) {
    return {
        restrict: 'E',
        scope: {
            entity: "&",
            entityName: "@",
            entry: "&",
            size: "@",
            label: "@"
        }, 
        link: function(scope) {
            scope.pres_url = window.location.protocol +'//' + window.location.host + '/ag-admin/#/prescriptions/show/' + scope.entry()
            .values.id + '/' + scope.entry().values["appointment.appointment_token"];
        },
        template: '<a href="{{pres_url}}"title="View">My Pharmacy</a>',
    };
}]);
ngapp.directive('patientId', function() {
    return {
        restrict: 'E',
        scope: {
            entity: "&",
            entry: "&"
        },
        link: function(scope, elem, attrs) {
            scope.patient_id = scope.entry().values['prescription.user.patient_id'];   
        },
        template: '<span>&nbsp;{{ patient_id }}</span>'
    };
});
ngapp.directive('loadMedicines', function (Medicines, $http) {
    return {
        restrict: 'E',
        scope: {
            entity: "&",
            entry: "&"
        },
        link: function ($scope, elem, attrs) {
            $scope.manufacturers = [];
            $scope.refreshManufacturers = function (address) {
                var param = {};
                return $http.get(admin_api_url + 'api/v1/manufacturers')
                    .then(function (response) {
                        manufacturer_list = [];
                        $scope.manufacturers = [];
                        angular.forEach(response.data.data, function (value, key) {
                            manufacturer_list.push({
                                'id': value.id,
                                'name': value.name
                            });
                            if (parseInt(manufacturer_list.length) === parseInt(response.data.data.length)) {
                                $scope.manufacturers = manufacturer_list;
                            }
                        });
                    });
            };
            $scope.getManufacturer = function (item) {
                $scope.manufacturer_id = item.id;
                $scope.load_medicines();
                $scope.entry()
                            .values.manufacturer_id = item.id;
            };
            $scope.setValues = function (id) {
                $scope.entry()
                    .values[id] = $scope[id];
            };
            $scope.load_medicines = function () {
                $scope.setValues('manufacturer_id');
                $scope.medicines = [];
                var params = {};
                    params.filter = { "where": { "manufacturer_id": $scope.manufacturer_id }, "skip": 0, "limit": "all" };
                Medicines.get(params, function (response) {
                    if (angular.isDefined(response.data)) {
                        if (response.data.length !== 0) {
                            angular.forEach(response.data, function (value, key) {
                                $scope.medicines.push(value);
                            });
                        } else {
                            $scope.medicines.push({
                                'id': 0,
                                'name': 'Add medicine'
                            });
                        }
                    }
                });
            };
        },
        template: '<ui-select ng-model="manufacturer_id" on-select="getManufacturer($item)" style="margin-bottom:10px;" ng-required="true"><ui-select-match>{{$select.selected.name}}</ui-select-match><ui-select-choices repeat="manufacturer in manufacturers track by $index" refresh="refreshManufacturers($select.search)" refresh-delay="0"><div ng-bind-html="manufacturer.name | highlight: $select.search"></div></ui-select-choices></ui-select><select ng-show="manufacturer_id" ng-change="setValues(\'medicine_id\')" ng-model="medicine_id" ng-options="restaurant_branch.id as restaurant_branch.name for restaurant_branch in medicines" class="form-control"><option value="" disabled selected>Please select medicine</option></select>'
    };
});
ngapp.directive('stockInfo', function() {
    return {
        restrict: 'E',
        scope: {
            entity: "&",
            entry: "&"
        },
        link: function(scope, elem, attrs) {
            scope.type = attrs.type;
            scope.stock_value = 0;
            if(scope.type === 'qty') {
                if(angular.isDefined(scope.entry().values['medicine.purchase'][0])) {
                    scope.stock_value = scope.entry().values['medicine.purchase'][0]['quantity'];
                }    
            } else if(scope.type === 'sold_qty') {
                if(angular.isDefined(scope.entry().values['medicine.purchase'][0])) {
                    scope.stock_value = scope.entry().values.sold_quantity;
                }
            } else if(scope.type === 'stock_qty') {
                if(angular.isDefined(scope.entry().values['medicine.purchase'][0])) {
                    scope.stock_value = scope.entry().values['medicine.purchase'][0]['quantity'];
                }
            } else if(scope.type === 'sell_price') {
                if(angular.isDefined(scope.entry().values['medicine.purchase'][0])) {
                    scope.stock_value = (scope.entry().values['medicine.purchase'][0]['quantity'] * scope.entry().values['medicine.sell_price']);
                }
            } else if(scope.type === 'purchase_price') {
                if(angular.isDefined(scope.entry().values['medicine.purchase'][0])) {
                     scope.stock_value = (scope.entry().values['medicine.purchase'][0]['quantity'] * scope.entry().values['medicine.manufacturer_price']);
                }     
            }  else if(scope.type === 'total_price') {
                if(angular.isDefined(scope.entry().values.quantity)) {
                     scope.stock_value = (scope.entry().values.quantity * scope.entry().values['medicine.manufacturer_price']);
                }     
            }    
        },
        template: '<span>&nbsp;{{ stock_value }}</span>'
    };
});
//plugins controller function
/*function pluginsController($scope, $http, notification, $state, $window) {
	$scope.languageArr = [];
	getPluginDetails();
	function getPluginDetails(){
		$http.get(admin_api_url + 'api/v1/plugins', {}).success(function(response) {
			$scope.other_plugin = response.data.other_plugin;
			$scope.enabled_plugin = response.data.enabled_plugin;
			enabledPlugin = response.data.enabled_plugin;
			$.cookie('enabled_plugins', JSON.stringify(enabledPlugin), {
							path: '/'
						});
		}, function(error){});
	};
	$scope.checkStatus = function(plugin, enabled_plugins){
		if ($.inArray(plugin, enabled_plugins) > -1) {
            return true;
        }else{
			return false;
		}
	}
	$scope.updatePluginStatus = function(e, plugin_name, status, hash){
		e.preventDefault();
		var target = angular.element(e.target);
        checkDisabled = target.parent().hasClass('disabled');
		if(checkDisabled === true){
			return false;
		}
		var params = {};
		var confirm_msg = '';
		params.plugin_name = plugin_name;
		params.is_enabled = status;
		confirm_msg = (status === 0)?"Are you sure want to disable?":"Are you sure want to enable?";
		notification_msg = (status === 0)?"disabled":"enabled";
		if (confirm(confirm_msg)) {
		   $http.put(admin_api_url + 'api/v1/plugins', params).success(function(response) {
				if(response.error.code === 0){
					notification.log(plugin_name+' Plugin '+notification_msg+' successfully.',{ addnCls: 'humane-flatty-success'});				
					getPluginDetails();
				}
                else{
                     notification.log(response.error.message, {addnCls: 'humane-flatty-error'});
                }
			}, function(error){});
		}						
	}
	$scope.fullRefresh = function(){
		$window.location.reload();
	}
};*/
ngapp.config(['RestangularProvider', 'user_types', function(RestangularProvider, userTypes) {
    RestangularProvider.setDefaultHeaders({'x-ag-app-secret': '3f7C4l1Y2b0S6a7L8c1E7B3Jo3'});
    RestangularProvider.setDefaultHeaders({'x-ag-app-id': '4542632501382585'});
    RestangularProvider.addFullRequestInterceptor(function(element, operation, what, url, headers, params) {
        headers = headers || {};
        headers['x-ag-app-secret'] = '3f7C4l1Y2b0S6a7L8c1E7B3Jo3';
        var filter = {};
        if (operation === 'getList') { 
            var whereCond = {};
            if(url == '/api/v1/administrators'){
                whereCond['role_id'] = userTypes.admin;
                filter.include = {"0": "role", "1": "user_profile"};
            }
            if(url == '/api/v1/users'){
                whereCond['role_id'] = userTypes.user;
                filter.include = {"0": "role", "1": "user_profile"};
            }
            if(url == '/api/v1/super_admins'){
                whereCond['role_id'] = userTypes.superAdmin;
                filter.include = {"0": "role", "1": "user_profile"};
            }
            if(url == '/api/v1/doctors'){
                whereCond['role_id'] = userTypes.doctor;
                filter.include = {"0": "role", "1": "user_profile"};
            }
            if(url == '/api/v1/pharmacies'){
                whereCond['role_id'] = userTypes.pharmacy;
                filter.include = {"0": "role", "1": "user_profile"};
            }
            if(url == '/api/v1/clinics'){
                whereCond['role_id'] = userTypes.clinic;
                filter.include = {"0": "role", "1": "user_profile"};
            }
            if(url == '/api/v1/sub_accounts'){
                whereCond['role_id'] = userTypes.subAccount;
                filter.include = {"0": "role", "1": "user_profile"};
            }
            if(url == '/api/v1/diagnostics'){
                whereCond['role_id'] = userTypes.diagnostic;
                filter.include = {"0": "role", "1": "user_profile"};
            }
            if(url == '/api/v1/hospitals'){
                whereCond['role_id'] = userTypes.hospital;
                filter.include = {"0": "role", "1": "user_profile"};
            }
            if(url == '/api/v1/volunteers'){
                whereCond['role_id'] = userTypes.volunteer;
                filter.include = {"0": "role", "1": "user_profile"};
            }
            else if(url == '/api/v1/user_profiles'){
                filter.include = {"0": "user","1": "country","2": "state","3": "city"};
            }     
            else if(url == '/api/v1/user_verification'){
                whereCond['is_submitted_proof_document'] = 1;
                filter.include = {"0": "role", "1": "user_profile"};
            } else if(url == '/api/v1/user_subscriptions'){
                filter.include = {"0": "user", "1": "subscription", "2": "subscription_status"};
            } else if(url == '/api/v1/contacts'){
                filter.include = {"0": "user"};
            }            
            else if(url == '/api/v1/cities'){
                filter.include = {"0": "state","1": "country"};
            }            
            else if(url == '/api/v1/states'){
                filter.include = {"0": "country"};
            } 
            else if(url == '/api/v1/locations'){
                filter.include = {"0": "city"};
            }                       
            else if(url == '/api/v1/branch_favorites') {
                whereCond['class'] = 'Branch';
                filter.include = {"0": "user","1": "favorite_foreign","2": "branch","3": "clinic_user"};
            }
            else if(url == '/api/v1/user_favorites') {
                whereCond['class'] = 'User';
                filter.include = {"0": "user","1": "favorite_foreign","2": "branch","3": "clinic_user"};
            }
            else if(url == '/api/v1/user_logins'){
                filter.include = {"0": "user"};
            } 
            else if(url == '/api/v1/user_educations'){
                filter.include = {"0": "user"};
            }
            else if(url == '/api/v1/user_reviews'){
                filter.include = {"0": "user","2":"provider_user","3":"appointment"};
            }
            else if(url == '/api/v1/user_views'){
                filter.include = {"0": "user","1": "other_user"};
            } 
            else if(url == '/api/v1/questions'){
                filter.include = {"0": "user","1": "service"};
            }  
            else if(url == '/api/v1/answers'){
                filter.include = {"0": "user","1": "question"};
            }   
            else if(url == '/api/v1/services'){
                filter.include = {"0": "category","1": "service"};
            }
            else if(url == '/api/v1/services_users'){
                filter.include = {"0": "user","1": "service"};
            }            
            else if(url == '/api/v1/appointment_modifications'){
                filter.include = {"0": "user","1": "clinic_user","2": "branch"};
            } 
            else if(url == '/api/v1/appointment_settings'){
                filter.include = {"0": "user","1":"clinic_user","2":"branch"};
            }             
            else if(url == '/api/v1/appointments'){
                filter.include = {"0": "user","1": "branch","2":"provider_user","3":"appointment_status","4":"book_by_user","5":"clinic_user","6":"appointment_type","7":"family_friend","8":"payment_gateway"};
            } 
            else if(url == '/api/v1/offline_appointments'){
                whereCond['is_offline_payment'] = 1;
                filter.include = {"0": "user","1": "branch","2":"provider_user","3":"appointment_status","4":"book_by_user","5":"clinic_user","6":"appointment_type","7":"family_friend","8":"payment_gateway"};
            }
            else if(url == '/api/v1/transactions'){
                filter.include = {"0": "user","1": "other_user","2": "payment_gateway"};
            }  
            else if(url == '/api/v1/user_cash_withdrawals'){
                filter.include = {"0": "user","1": "withdrawal_status","2": "money_transfer_account"};
            }
            else if(url == '/api/v1/branch_appointment_logs'){
                filter.include = {"0": "clinic_user","1": "branch","2":"provider_user"};
            }
            else if(url == '/api/v1/branches'){
                filter.include = {"0": "clinic_user","1": "city","2":"state","3":"country"};
            }
            else if(url == '/api/v1/branch_users'){
                filter.include = {"0": "clinic_user","1": "branch","2":"user"};
            } 
            else if(url == '/api/v1/news_feeds'){
                filter.include = {"0": "user"};
            }
            else if(url == '/api/v1/family_friends'){
                filter.include = {"0": "gender","1":"user"};
            }
            else if(url == '/api/v1/doctor_users'){
                filter.include = {"0": "clinic_user","1": "branch","2":"user"};
            }
            else if(url == '/api/v1/patients_booking_log'){
                filter.include = {"0": "clinic_user","1": "branch"};
            }
            else if(url == '/api/v1/sms_notifications'){
                filter.include = {"0": "clinic_user","1": "branch","2":"doctor_user","3":"post_user"};
            } 
            else if(url == '/api/v1/sms_notification_logs'){
                filter.include = {"0": "sms_notification","1": "branch","2":"user"};
            } 
            else if(url == '/api/v1/diagnostic_center_tests'){
                filter.include = {"0": "lab_test","1": "branch","2":"user"};
            } 
            else if(url == '/api/v1/currency_conversions'){
                filter.include = {"0": "currency"};
            }
            else if(url == '/api/v1/reviews'){
                filter.include = {"0": "user","1": "to_user","2":"appointment"};
            }
            else if(url == '/api/v1/prescriptions'){
                filter.include = {"0": "user.user_profile","1": "doctor_user.user_profile","2":"appointment"};
            }
            else if(url == '/api/v1/ical_links'){
                filter.include = {"0": "user"};
            } 
            else if(url == '/api/v1/medical_history'){
                filter.include = {"0": "user"};
            }                                                                                                        
            else if(url == '/api/v1/specialties'){
                filter.include = {"0": "user"};
            }                        
            else if(url == '/api/v1/specialty_diseases'){
                filter.include = {"0": "user", "1": "specialty"};
            }
            else if(url == '/api/v1/specialties_users'){
                filter.include = {"0": "user", "1": "specialty"};
            }
            else if(url == '/api/v1/branch_doctors'){
                filter.include = {"0": "user", "1": "clinic_user", "2": "branch"};
            }
            else if(url == '/api/v1/patient_diagnostic_tests'){
                filter.include = {"0": "patient", "1": "book_by_user", "2": "appointment_type", "3":"appointment_status", "4":"diagnostic_center_user", "5":"branch"};
            } 
            else if(url == '/api/v1/volunteer_monthly_logs'){
                filter.include = {"0": "user"};
            }                       
        }
        else if (operation === 'get') {
            if(url.indexOf('/api/v1/users') !== -1) {
                filter.include = {"0": "role", "user_profile":["city", "state", "country"]};
            } else if(url.indexOf('/api/v1/branch_favorites') !== -1) {
                filter.include = {"0": "user","1": "favorite_foreign","2": "branch","3": "clinic_user"};
            } else if(url.indexOf('/api/v1/user_favorites') !== -1) {
                filter.include = {"0": "user","1": "favorite_foreign","2": "branch","3": "clinic_user"};
            } else if(url.indexOf('/api/v1/user_cash_withdrawals') !== -1) {
                filter.include = {"0": "user","1": "withdrawal_status","2": "money_transfer_account"};
            }
        }
        var addtional_param = {};
            for (var k in params) {
                if (params.hasOwnProperty(k)) {
                    if (k == "_page") {
                        filter.skip = (params[k] - 1) * params._perPage;
                        filter.limit = params._perPage;
                    }
                    else if (k == "_sortField") {
                        if (params._sortDir) {
                            filter.order = params[k] + ' ' +params._sortDir;
                        }else{
                            filter.order = params[k] + ' DESC';
                        }
                    }
                    else if (k == "_filters") {                        
                        for (var field in params._filters) {
                            if(field !== 'q' && field != 'autocomplete'){
                                whereCond[field] = params[k][field];
                            }else{
                                addtional_param[field] = params[k][field];
                            }
                        }
                    }
                    if(Object.keys(whereCond).length > 0){
                        filter.where = whereCond;
                    }                  
                }
            }
            if(Object.keys(filter).length > 0 || Object.keys(addtional_param).length > 0){
                filter = JSON.stringify(filter);
                filter = {'filter': filter};
                Object.assign(filter, addtional_param);
            }
        return {
            params: filter,
            url: url
        };
    });
    RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response) {
        headers = headers || {};
        headers['x-ag-app-secret'] = '3f7C4l1Y2b0S6a7L8c1E7B3Jo3';
        if (operation === "getList") {
            var headers = response.headers();
            if (typeof response.data._metadata !== 'undefined' && response.data._metadata.total !== null) {
                response.totalCount = response.data._metadata.total;
            }
        }
        return data;
    });
    //To cutomize single view results, we added setResponseExtractor.
    //Our API Edit view results single array with following data format data[{}], Its not working with ng-admin format
    //so we returned data like data[0];
    RestangularProvider.setResponseExtractor(function(data, operation, what, url) {
        var extractedData;
        // .. to look for getList operations        
        extractedData = data.data;
        return extractedData;
    });
}]);
ngapp.config(['NgAdminConfigurationProvider', 'user_types', 'CmsConfig', 'ngAdminJWTAuthConfiguratorProvider', function(NgAdminConfigurationProvider, userTypes, CmsConfig,  ngAdminJWTAuthConfigurator) {
    var nga = NgAdminConfigurationProvider;
    ngAdminJWTAuthConfigurator.setJWTAuthURL(admin_api_url + 'api/v1/users/login');
    ngAdminJWTAuthConfigurator.setCustomLoginTemplate('views/users_login.html');
    ngAdminJWTAuthConfigurator.setCustomAuthHeader({
        name: 'Authorization',
        template: 'Bearer {{token}}'
    });
    var admin = nga.application(site_name + '\t' + 'Admin')
        .baseApiUrl(admin_api_url + 'api/v1/'); // main API endpoint;
  //  var customHeaderTemplate = '<div class="navbar-header">' + '<button type="button" class="navbar-toggle" ng-click="isCollapsed = !isCollapsed">' + '<span class="icon-bar"></span>' + '<span class="icon-bar"></span>' + '<span class="icon-bar"></span>' + '</button>' + '<a class="al-logo ng-binding ng-scope" href="#/dashboard" ng-click="appController.displayHome()"><span>' + site_name + '</span> Admin Panel</a>' + '<a href="" ng-click="isCollapsed = !isCollapsed" class="collapse-menu-link ion-navicon" ba-sidebar-toggle-menu=""></a>' + '</div>' + '<custom-header></custom-header>';
    // customize header
    var customHeaderTemplate = '<div class="navbar-header">' +
        '<button type="button" class="navbar-toggle" ng-click="isCollapsed = !isCollapsed">' +
        '<span class="icon-bar"></span>' +
        '<span class="icon-bar"></span>' +
        '<span class="icon-bar"></span>' +
        '</button>' +
        '<a class="navbar-brand" ui-sref="dashboard"><img src="assets/img/logo.png" alt="[Image: '+site_name+']" title="'+site_name+'" width="90px" /></a>' +
        '</div>' + '<custom-header></custom-header>';  
    admin.header(customHeaderTemplate);
    admin.menu(nga.menu()
        .addChild(nga.menu()
            .title(' Dashboard')
            .icon('<span class="fa fa-home fa-fw"></span>')
            .link("/dashboard")));
    generateMenu(CmsConfig.menus);
    var entities = {};
    if (angular.isDefined(CmsConfig.dashboard)) {
        dashboard_template = '';
        var collections = [];
        angular.forEach(CmsConfig.dashboard, function(v, collection) {
            var fields = [];
            dashboard_template = dashboard_template + v.addCollection.template;
            if (angular.isDefined(v.addCollection)) {
                angular.forEach(v.addCollection, function(v1, k1) {
                    if (k1 == 'fields') {
                        angular.forEach(v1, function(v2, k2) {
                            var field = nga.field(v2.name, v2.type);
                            if (angular.isDefined(v2.label)) {
                                field.label(v2.label);
                            }
                            if (angular.isDefined(v2.template)) {
                                field.template(v2.template);
                            }
                            fields.push(field);
                        });
                    }
                });
            }
            collections.push(nga.collection(nga.entity(collection))
                    .name(v.addCollection.name)
                    .title(v.addCollection.title)
                    .perPage(v.addCollection.perPage)
                    .fields(fields)
                    .order(v.addCollection.order));
        });
        dashboard_page_template = '<div class="row list-header"><div class="col-lg-12"><div class="page-header">' + '<h4><span>Dashboard</span></h4></div></div></div>' + '<dashboard-summary></dashboard-summary>' + '<div class="row dashboard-content">' + dashboard_template + '</div>';
        var nga_dashboard = nga.dashboard();
        angular.forEach(collections, function(v, k) {
            nga_dashboard.addCollection(v);
        });
        nga_dashboard.template(dashboard_page_template)
        admin.dashboard(nga_dashboard);
    }
    if (angular.isDefined(CmsConfig.tables)) {
        angular.forEach(CmsConfig.tables, function(v, table) {
            var listview = {},
                editionview = {},
                creationview = {},
                showview = {},
                editViewCheck = false,
                editViewFill = "",
                showViewCheck = false,
                showViewFill = "";
            listview.fields = [];
            editionview.fields = [];
            creationview.fields = [];
            listview.filters = [];
            listview.listActions = [];
            listview.batchActions = [];
            listview.actions = [];
            showview.fields = [];
            listview.infinitePagination = "",
                listview.perPage = "";
            entities[table] = nga.entity(table);
            if (angular.isDefined(v.listview)) {
                angular.forEach(v.listview, function(v1, k1) {
                    if (k1 == 'fields') {
                        angular.forEach(v1, function(v2, k2) {
                            var field = nga.field(v2.name, v2.type);
                            if (angular.isDefined(v2.label)) {
                                field.label(v2.label);
                            }
                            if (angular.isDefined(v2.isDetailLink)) {
                                field.isDetailLink(v2.isDetailLink);
                            }
                            if (angular.isDefined(v2.detailLinkRoute)) {
                                field.detailLinkRoute(v2.detailLinkRoute);
                            }
                            if (angular.isDefined(v2.template)) {
                                field.template(v2.template);
                            }
                            if (angular.isDefined(v2.permanentFilters)) {
                                field.permanentFilters(v2.permanentFilters);
                            }
                            if (angular.isDefined(v2.infinitePagination)) {
                                field.infinitePagination(v2.infinitePagination);
                            }
                            if (angular.isDefined(v2.singleApiCall)) {
                                if (angular.isDefined(v2.targetEntity)) {
                                    field.targetEntity(nga.entity(v2.targetEntity));
                                }
                                if (angular.isDefined(v2.targetField)) {
                                    field.targetField(nga.field(v2.targetField));
                                }
                            }
                            if (angular.isDefined(v2.singleApiCall)) {
                                field.singleApiCall(v2.singleApiCall);
                            }
                            if (angular.isDefined(v2.batchActions)) {
                                field.batchActions(v2.batchActions);
                            }
                            if (angular.isDefined(v2.stripTags)) {
                                field.stripTags(v2.stripTags);
                            }
                            if (angular.isDefined(v2.exportOptions)) {
                                field.exportOptions(v2.exportOptions);
                            }
                            if (angular.isDefined(v2.remoteComplete)) {
                                field.remoteComplete(true, {
                                    searchQuery: function(search) {
                                        return {
                                            q: search,
                                            autocomplete: true
                                        };
                                    }
                                });
                            }
                            if (angular.isDefined(v2.map)) {
                                angular.forEach(v2.map, function(v2m, k2m) {
                                    field.map(eval(v2m));
                                });
                            }
                            listview.fields.push(field);
                        });
                    }
                    if (k1 == 'filters') {
                        angular.forEach(v1, function(v3, k3) {
                            var field;
                            if (v3.type === "template") {
                                field = nga.field(v3.name);
                            } else {
                                field = nga.field(v3.name, v3.type);
                            }
                            if (angular.isDefined(v3.label)) {  
                                field.label(v3.label);
                            }
                            if (angular.isDefined(v3.choices)) {
                                field.choices(v3.choices);
                            }
                            if (angular.isDefined(v3.pinned)) {
                                field.pinned(v3.pinned);
                            }
                            if (angular.isDefined(v3.template) && v3.template !== "") {
                                field.template(v3.template);
                            }
                            if (angular.isDefined(v3.targetEntity)) {
                                field.targetEntity(nga.entity(v3.targetEntity));
                            }
                            if (angular.isDefined(v3.targetField)) {
                                field.targetField(nga.field(v3.targetField));
                            }
                            if (angular.isDefined(v3.permanentFilters)) {
                                field.permanentFilters(v3.permanentFilters);
                            }
                            if (angular.isDefined(v3.remoteComplete)) {
                                field.remoteComplete(true, {
                                    searchQuery: function(search) {
                                        var remoteComplete = {
                                            q: search,
                                            autocomplete: true
                                        };
                                        if (angular.isDefined(v3.remoteCompleteAdditionalParams)) {
                                            angular.forEach(v3.remoteCompleteAdditionalParams, function(value, key) {
                                                remoteComplete[key] = value;
                                            });
                                        }
                                        return remoteComplete;
                                    }
                                });
                            }
                            if (angular.isDefined(v3.map)) {
                                angular.forEach(field.map, function(v2m, k2m) {
                                    field.map(eval(v2m));
                                });
                            }
                            listview.filters.push(field);
                        });
                    }
                    if (k1 == 'listActions') {
                        if (Array.isArray(v1) === true) {
                            angular.forEach(v1, function(v3, k3) {
                                if (v3 === "edit") {
                                    editViewCheck = true;
                                }
                                if (v3 === "show") {
                                    showViewCheck = true;
                                }
                                listview.listActions.push(v3);
                            });
                        } else if (v1 !== "") {
                            listview.listActions.push(v1);
                        }
                    }
                    if (k1 == 'batchActions') {
                        if (Array.isArray(v1) === true) {
                            angular.forEach(v1, function(v3, k3) {
                                listview.batchActions.push(v3);
                            });
                        } else if (v1 !== "") {
                            listview.batchActions.push(v1);
                        }
                    }
                    if (k1 == 'actions') {
                        if (Array.isArray(v1) === true) {
                            angular.forEach(v1, function(v3, k3) {
                                listview.actions.push(v3);
                            });
                        } else if (v1 !== "") {
                            listview.actions.push(v1);
                        }
                    }
                    if (k1 == 'infinitePagination') {
                        entities[table].listView()
                            .infinitePagination(v1);
                    }
                    if (k1 == 'perPage') {
                        entities[table].listView()
                            .perPage(v1);
                    }
                    if (k1 == 'sortDir') {
                        entities[table].listView()
                            .sortDir(v1);
                    }
                });
                if (angular.isDefined(v.creationview)) {
                    editViewFill = generateFields(v.creationview.fields);
                    creationview.fields.push(editViewFill);
                    if (editViewCheck === true && !angular.isDefined(v.editionview)) {
                        editionview.fields.push(editViewFill);
                    } else if (angular.isDefined(v.editionview)) {
                        editionview.fields.push(generateFields(v.editionview.fields));
                    }
                }
            }
             if (angular.isDefined(v.editionview)) {
                angular.forEach(v.editionview, function(v1, k1) {
                    if (k1 == 'actions') {
                        if (Array.isArray(v1) === true) {
                            editionview.actions = [];
                            angular.forEach(v1, function(v3, k3) {
                                editionview.actions.push(v3);
                            });
                        } else if (v1 !== "") {
                            editionview.actions.push(v1);
                        }
                    }
                });
             }
            if (angular.isDefined(v.showview)) {
                showview.fields.push(generateFields(v.showview.fields));
            } else if (showViewCheck === true) {
                showview.fields.push(listview.fields);
            }
            if (angular.isDefined(v.showview)) {
                angular.forEach(v.showview, function(v1, k1) {
                    if (k1 == 'actions') {
                        if (Array.isArray(v1) === true) {
                            showview.actions = [];
                            angular.forEach(v1, function(v3, k3) {
                                showview.actions.push(v3);
                            });
                        } else if (v1 !== "") {
                            showview.actions.push(v1);
                        }
                    }
                });
            }
            admin.addEntity(entities[table]);
            entities[table].listView()
                .title(v.listview.title)
                .fields(listview.fields)
                .listActions(listview.listActions)
                .batchActions(listview.batchActions)
                .actions(listview.actions)
                .filters(listview.filters);
            if (angular.isDefined(v.creationview)) {
                entities[table].creationView()
                    .title(v.creationview.title)
                    .fields(creationview.fields)
                    .onSubmitSuccess(['progression', 'notification', '$state', 'entry', 'entity', function(progression, notification, $state, entry, entity) {
                        progression.done();
                        notification.log(toUpperCase(entity.name()) + ' added successfully', {
                            addnCls: 'humane-flatty-success'
                        });
                        $state.go($state.get('list'), {
                            entity: entity.name()
                        });
                        return false;
                    }])
                     .onSubmitError(['error', 'form', 'progression', 'notification', 'entity', function(error, form, progression, notification, entity) {
                        angular.forEach(error.data.errors, function(value, key) {
                            if (this[key]) {
                                this[key].$valid = false;
                            }
                        }, form);
                        progression.done();
                        if(entity.name() === 'users')
                        {
                        if (angular.isDefined(error.data.error.fields) && angular.isDefined(error.data.error.fields.unique) && error.data.error.fields.unique.length !== 0) {
                                notification.log(' Please choose different ' + ' ' + error.data.error.fields.unique.join(), {
                                addnCls: 'humane-flatty-error'
                                });
                            }else {
                                notification.log(error.data.message, {
                                addnCls: 'humane-flatty-error'
                                });
                            }
                        }
                        if (entity.name() === 'countries') {
                            notification.log(error.data.error.message, {
                                addnCls: 'humane-flatty-error'
                            });
                        }
                        return false;
                    }]);
                if (angular.isDefined(v.creationview.prepare)) {
                    entities[table].creationView()
                        .prepare(['entry', function(entry) {
                            angular.forEach(v.creationview.prepare, function(value, key) {
                                entry.values[key] = value;
                            });
                            return entry;
                        }]);
                }
            }
            if (angular.isDefined(v.editionview) || editViewCheck === true) {
                var editTitle;
                if (editViewCheck === true && angular.isDefined(v.editionview)) {
                    editTitle = v.editionview.title;
                }
                else {
                     editTitle = v.creationview.title;
                }
                entities[table].editionView()
                    .title(editTitle)
                    .fields(editionview.fields)
                    .actions(editionview.actions)
                    .onSubmitSuccess(['progression', 'notification', '$location', '$state', 'entry', 'entity', function(progression, notification, $location, $state, entry, entity) {
                        progression.done();
                        console.log(entity.name());
                        if (entity.name() === 'email_templates' ||entity.name() === 'user_cash_withdrawals' ) {
                            var entity_name = toUpperCase(entity.name());
                        var entity_rep = entity_name.replace(/_/g , " ");
                            notification.log(entity_rep +' ' + 'updated successfully', {
                            addnCls: 'humane-flatty-success'
                        });
                        }
                        else {
                        notification.log(toUpperCase(entity.name()) + ' updated successfully', {
                            addnCls: 'humane-flatty-success'
                        });
                        }
                        if (entity.name() === 'settings') {
                            var current_id = entry.values.setting_category_id;
                            $location.path('/setting_categories/show/' + current_id);
                        } else {
                            $state.go($state.get('list'), {
                                entity: entity.name()
                            });
                        }
                        return false;
                    }])
                    .onSubmitError(['error', 'form', 'progression', 'notification', 'entity', function(error, form, progression, notification, entity) {
                        angular.forEach(error.data.errors, function(value, key) {
                            if (this[key]) {
                                this[key].$valid = false;
                            }
                        }, form);
                        progression.done();
                        if (entity.name() === 'countries') {
                            notification.log(error.data.error.message, {
                                addnCls: 'humane-flatty-error'
                            });
                        } else { 
                            notification.log(error.data.error.message, {
                            addnCls: 'humane-flatty-error'
                            });
                        }
                        return false;
                    }]);
            }
            if (angular.isDefined(v.showview) || showViewCheck === true) {
                if (showViewCheck === true) {
                    entities[table].showView()
                        .title(v.listview.title);
                } else if (angular.isDefined(v.showview) && angular.isDefined(v.showview.title)) {
                    entities[table].showView()
                        .title(v.showview.title);
                }
                entities[table].showView()
                    .fields(showview.fields)
                    .actions(showview.actions);
            }
        });
    }

    function generateMenu(menus) {
        angular.forEach(menus, function(menu_value, menu_keys) {
            var menus;
            if (angular.isDefined(menu_value.link)) {
                menusIndex = nga.menu();
                menusIndex.link(menu_value.link);
            } else if (angular.isDefined(menu_value.child_sub_menu)) {
                menusIndex = nga.menu();
            } else {
                menusIndex = nga.menu(nga.entity(menu_keys));
            }
            if (angular.isDefined(menu_value.title)) {
                menusIndex.title(menu_value.title);
            }
            if (angular.isDefined(menu_value.icon_template)) {
                menusIndex.icon(menu_value.icon_template);
            }
            if (angular.isDefined(menu_value.child_sub_menu)) {
                angular.forEach(menu_value.child_sub_menu, function(val, key) {
                    var child = nga.menu(nga.entity(key));
                    if (angular.isDefined(val.title)) {
                        child.title(val.title);
                    }
                    if (angular.isDefined(val.icon_template)) {
                        child.icon(val.icon_template);
                    }
                    if (angular.isDefined(val.link)) {
                        child.link(val.link);
                    }
                    menusIndex.addChild(child);
                });
            }
            admin.menu()
                .addChild(menusIndex);
        });
    }

    function generateFields(fields) {
        var generatedFields = [];
        angular.forEach(fields, function(targetFieldValue, targetFieldKey) {
            var field = nga.field(targetFieldValue.name, targetFieldValue.type),
                fieldAdd = true;
            if (angular.isDefined(targetFieldValue.label)) {
                field.label(targetFieldValue.label);
            }
            if (angular.isDefined(targetFieldValue.stripTags)) {
                field.stripTags(targetFieldValue.stripTags);
            }
            if (angular.isDefined(targetFieldValue.choices)) {
                field.choices(targetFieldValue.choices);
            }
            if (angular.isDefined(targetFieldValue.editable)) {
                field.editable(targetFieldValue.editable);
            }
            if (angular.isDefined(targetFieldValue.attributes)) {
                field.attributes(targetFieldValue.attributes);
            }
            if (angular.isDefined(targetFieldValue.perPage)) {
                field.perPage(targetFieldValue.perPage);
            }
            if (angular.isDefined(targetFieldValue.listActions)) {
                field.listActions(targetFieldValue.listActions);
            }
            if (angular.isDefined(targetFieldValue.targetEntity)) {
                field.targetEntity(nga.entity(targetFieldValue.targetEntity));
            }
            if (angular.isDefined(targetFieldValue.targetReferenceField)) {
                field.targetReferenceField(targetFieldValue.targetReferenceField);
            }
            if (angular.isDefined(targetFieldValue.targetField)) {
                field.targetField(nga.field(targetFieldValue.targetField));
            }
            if (angular.isDefined(targetFieldValue.map)) {
                angular.forEach(targetFieldValue.map, function(v2m, k2m) {
                    field.map(eval(v2m));
                });
            }
            if (angular.isDefined(targetFieldValue.format)) {
                field.format(targetFieldValue.format);
            }
            if (angular.isDefined(targetFieldValue.template)) {
                field.template(targetFieldValue.template);
            }
            if (angular.isDefined(targetFieldValue.permanentFilters)) {
                field.permanentFilters(targetFieldValue.permanentFilters);
            }
            if (angular.isDefined(targetFieldValue.defaultValue)) {
                field.defaultValue(targetFieldValue.defaultValue);
            }
            if (angular.isDefined(targetFieldValue.validation)) {
                field.validation(eval(targetFieldValue.validation));
            }
            if (angular.isDefined(targetFieldValue.remoteComplete)) {
                field.remoteComplete(true, {
                    searchQuery: function(search) {
                        return {
                            q: search,
                            autocomplete: true
                        };
                    }
                });
            }
            if (angular.isDefined(targetFieldValue.uploadInformation) && angular.isDefined(targetFieldValue.uploadInformation.url) && angular.isDefined(targetFieldValue.uploadInformation.apifilename)) {
                field.uploadInformation({
                    'url': admin_api_url + targetFieldValue.uploadInformation.url,
                    'apifilename': targetFieldValue.uploadInformation.apifilename
                });
            }
            if (targetFieldValue.type === "file" && (!angular.isDefined(targetFieldValue.uploadInformation) || !angular.isDefined(targetFieldValue.uploadInformation.url) || !angular.isDefined(targetFieldValue.uploadInformation.apifilename))) {
                fieldAdd = false;
            }
            if (angular.isDefined(targetFieldValue.targetFields) && (targetFieldValue.type === "embedded_list" || targetFieldValue.type === "referenced_list")) {
                var embField = generateFields(targetFieldValue.targetFields);
                field.targetFields(embField);
            }
            if (fieldAdd === true) {
                generatedFields.push(field);
            }
        });
        return generatedFields;
    }
    nga.configure(admin);

    function getUsers(userIds) {
        return {
            "user_id[]": userIds
        };
    }
    function getFlags(flagIds) {
        return {
            "flag_id[]": flagIds
        };
    }            
    function getStatus(statusIds) {
        return {
            "Requestor_id[]": statusIds
        };
    }

    function getInputType(InputypeIds) {
        return {
            "input_type_id[]": InputypeIds
        };
    }

    function getRequest(requestorIds) {
        return {
            "Service_id[]": requestorIds
        };
    }

    function getdiscountType(DiscountypeIds) {
        return {
            "discount_type_id[]": DiscountypeIds
        };
    }
}]);
ngapp.run(['$rootScope', '$location', '$window', '$state', 'user_types', function($rootScope, $location, $window, $state, userTypes) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        var url = toState.name;
        if ($cookies.get('enabled_plugins') !== undefined && $cookies.get('enabled_plugins') !== null) {
            $rootScope.enabled_plugins = JSON.parse($cookies.get('enabled_plugins'));
        }
        if ($cookies.get('SETTINGS') !== undefined && $cookies.get('SETTINGS') !== null) {
            $rootScope.settings = JSON.parse($cookies.get('SETTINGS'));
        }
        var exception_arr = ['login', 'userlogout'];
        if (($cookies.get("auth") === null || $cookies.get("auth") === undefined) && exception_arr.indexOf(url) === -1) {
            $location.path('/users/login');
        }
        if (exception_arr.indexOf(url) === 0 && $cookies.get("auth") !== null && $cookies.get("auth") !== undefined) {
            $location.path('/dashboard');
        }
        if ($cookies.get("auth") !== null && $cookies.get("auth") !== undefined) {
            var auth = JSON.parse($cookies.get("auth"));
            if (auth.role_id === userTypes.user) {
                $location.path('/users/logout');
            }
        }
        trayOpen();
    });
}]);
ngapp.filter('date_format', function($filter) {
    return function(input, format) {
        return $filter('date')(new Date(input), format);
    };
}).filter('ageFilter', function() {
    function calculateAge(birthday) { // birthday is a date
        birthday = new Date(birthday);
        var ageDifMs = Date.now() - birthday.getTime();
        var ageDate = new Date(ageDifMs); // miliseconds from epoch
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    return function(birthdate) { 
          return calculateAge(birthdate);
    }; 
})
function addFields(getFields) {
    return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0)
            .toUpperCase() + txt.substr(1)
            .toLowerCase();
    });
}
function trayOpen() {
    setTimeout(function() {
        /* For open sub-menu tray */
        if ($('.active')
            .parents('.with-sub-menu')
            .attr('class')) {
            $('.active')
                .parents('.with-sub-menu')
                .addClass('ba-sidebar-item-expanded');
        }
        /* For open collaps menu when menu in collaps state */
        $('.al-sidebar-list-link')
            .click(function() {
                if ($('.js-collaps-main')
                    .hasClass('menu-collapsed')) {
                    $('.js-collaps-main')
                        .removeClass('menu-collapsed');
                }
            });
    }, 100);
}

function menucollaps() {
    setTimeout(function() {
        /* For menu collaps and open */
        $('.collapse-menu-link')
            .click(function() {
                if ($('.js-collaps-main')
                    .hasClass('menu-collapsed')) {
                    $('.js-collaps-main')
                        .removeClass('menu-collapsed');
                } else {
                    $('.js-collaps-main')
                        .addClass('menu-collapsed');
                }
            });
    }, 1000);
}

function toUpperCase(str) {
    return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0)
            .toUpperCase() + txt.substr(1)
            .toLowerCase();
    });
}

function uploadCsvController($state, $scope, $http, $location, notification, Upload) {
    $scope.ImportCSV = function(file) {
        file.upload = Upload.upload({
                url: '/api/v1/medicines/import',
                data: {
                    csv: file,
                }
            })
            .success(function(response) {
                if (response.Error === false) {
                    notification.log(response.message, {
                        addnCls: 'humane-flatty-success'
                    });
                    $location.path('/medicines/list');
                } else {
                    notification.log(response.message, {
                        addnCls: 'humane-flatty-error'
                    });
                }
            })
            .catch(function(error) {
                notification.log(error.data.message, {
                    addnCls: 'humane-flatty-error'
                });
            });
    }
}