/*globals $:false */
'use strict';
/**
 * @ngdoc overview
 * @name abs
 * @description
 * # abs
 *
 * Main module of the application.
 */
angular.module("abs", [
        'abs.Constant',
        'ngResource',
        'ui.router.state',
        'ui.router',
        'ui.bootstrap',
        'ngSanitize',
        'satellizer',
        'ngAnimate',
        'angular-growl',
        'pascalprecht.translate',
        'ngCookies',
        'ngMap',
        'google.places',
        'angulartics',
        'angulartics.google.analytics',
        'angulartics.facebook.pixel',
        'tmh.dynamicLocale',
        'angular-loading-bar',
        'angulartics',
        'angular-input-stars',
        'mwl.calendar',
        'ngFileUpload',
        'vcRecaptcha',
        'mgcrea.ngStrap',
        'hm.readmore',
        'checklist-model',
        'multipleDatePicker',
        'daterangepicker',
        'oitozero.ngSweetAlert',
        'angular-md5',
        'ngScrollbars',
        'textAngular',
        'ngTagsInput',
        'uiSwitch',
        'jkuri.gallery',
        'localytics.directives',
        'http-auth-interceptor',
        'slugifier'
    ])
    .config(['$stateProvider', '$urlRouterProvider', '$translateProvider', function($stateProvider, $urlRouterProvider, $translateProvider) {
        //$translateProvider.translations('en', translations).preferredLanguage('en');
        $translateProvider.useStaticFilesLoader({
            prefix: 'scripts/l10n/',
            suffix: '.json'
        });
        $translateProvider.preferredLanguage('en');
        $translateProvider.useLocalStorage(); // saves selected language to localStorage
        // Enable escaping of HTML
        $translateProvider.useSanitizeValueStrategy(null);
        //	$translateProvider.useCookieStorage();
    }])
     .config(function(tmhDynamicLocaleProvider) {
        tmhDynamicLocaleProvider.localeLocationPattern('scripts/l10n/angular-i18n/angular-locale_{{locale}}.js');
    })
    .factory('authInterceptorService', ['$cookies',
        function($cookies) {
            var oauthTokenInjector = {
                request: function(config) {
                    config.headers['x-ag-app-id'] = '4542632501382585';
                    config.headers['x-ag-app-secret'] = '3f7C4l1Y2b0S6a7L8c1E7B3Jo3';
                    if (config.url.indexOf('.html') === -1) {
                        if ($cookies.get("token") !== null && angular.isDefined($cookies.get("token"))) {
                            config.headers.Authorization = 'Bearer ' +$cookies.get("token");
                        }
                    }
                    return config;
                    }
            };
            return oauthTokenInjector;
        }
    ])
    .config(['$httpProvider',
        function($httpProvider) {
            $httpProvider.interceptors.push('interceptor');
            $httpProvider.interceptors.push(function() {
                return {
                    'request': function(config) {
                        return config;
                    }
                };
            });
            $httpProvider.interceptors.push('authInterceptorService');
        }
    ])
    .config(function(tagsInputConfigProvider) {
        tagsInputConfigProvider.setDefaults('tagsInput', {
                placeholder: '',
                minLength: 1,
                addOnEnter: false
            })
            .setDefaults('autoComplete', {
                debounceDelay: 200,
                loadOnDownArrow: true,
                loadOnEmpty: true
            });
    })
    .provider('googleMapServices', function() {
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
    })
    .config(function($authProvider, $windowProvider) {
        var $window = $windowProvider.$get();
        var params={};
        params.filter = '{"include":{"0":{"fields":{"api_key","slug"}}}}';
        $.ajax({
         url: '/api/v1/providers',
         data: params,
         type: "GET",
         headers: { 'x-ag-app-id': '4542632501382585','x-ag-app-secret': '3f7C4l1Y2b0S6a7L8c1E7B3Jo3'},
         success: function(response) {
                var credentials = {};
                var url = '';
                var providers = response;
                angular.forEach(providers.data, function(res, i) {
                    //jshint unused:false
                    url = $window.location.protocol + '//' + $window.location.host + '/api/v1/users/social_login?type=' + res.slug;
                    credentials = {
                        clientId: res.api_key,
                        redirectUri: url,
                        url: url
                    };
                    if (res.slug === 'facebook') {
                        $authProvider.facebook(credentials);
                    }
                    if (res.slug === 'google') {
                        $authProvider.google(credentials);
                    }
        
                    if (res.slug === 'twitter') {
                        $authProvider.twitter(credentials);
                    }
                });
          }
      });
    })
   .config(['$locationProvider', function($locationProvider) {
        $locationProvider.html5Mode(true);
    }])
    .config(function($stateProvider, $urlRouterProvider) {
        var getToken = {
            'TokenServiceData': function(TokenService, $q) {
                return $q.all({
                    AuthServiceData: TokenService.promise,
                    SettingServiceData: TokenService.promiseSettings
                });
            }
    };
    $urlRouterProvider.otherwise('/');
        $stateProvider.state('home', {
            url: '/',
            templateUrl: 'views/home.html',
            controller: 'HomeController',
            resolve: getToken
        })
        .state('login', {
            url: '/users/login',
            templateUrl: 'views/login.html',
            controller: 'UserLoginController',
            resolve: getToken
        })
        .state('login_user', {
            url: '/users/login_user',
            templateUrl: 'views/login_user.html',
            controller: 'UserRegisterController',
            resolve: getToken
        })
        .state('register', {
            url: '/users/register/:user_type',
            templateUrl: 'views/register.html',
            controller: 'UserRegisterController',
            resolve: getToken
        })
        .state('otp_verify',{
            url: '/users/:id/otp/verify',
            templateUrl: 'views/otp_verify.html',
            controller: 'UserRegisterController',
            resolve: getToken
        })
        .state('users_logout', {
            url: '/users/logout',
            controller: 'UsersLogoutController',
            resolve: getToken
        })
        .state('users_activation', {
            url: '/users/:id/activate/:hash',
            controller: 'UserActivateController',
            resolve: getToken
        })
        .state('users_change_password', {
            url: '/users/change_password',
            templateUrl: 'views/change_password.html',
            controller: 'ChangePasswordController',
            resolve: getToken
        })
        .state('user_profile', {
            url: '/users/edit_profile',
            templateUrl: 'views/user_profile.html',
            controller: 'UserProfileController',
            resolve: getToken
        })
        .state('user_view', {
            url: '/doctors/:id/:slug',
            templateUrl: 'views/doctor_profile.html',
            resolve: getToken
        })
        .state('patient_view', {
            url: '/patient/:id/:slug?info',
            templateUrl: 'views/patient_view_profile.html',
            resolve: getToken
        })
        .state('pages_view', {
            url: '/pages/:id/:slug',
            templateUrl: 'views/pages_view.html',
            resolve: getToken
        })
        .state('account_payout', {
            url: '/account/payout',
            templateUrl: 'views/account_payout.html',
            resolve: getToken
        })
        .state('transaction', {
            url: '/account/transaction_history',
            templateUrl: 'views/account_transaction_details.html',
            resolve: getToken
        })
        .state('transactions', {
            url: '/transactions',
            templateUrl: 'views/transactions.html',
            resolve: getToken
        })
        .state('dashboard', {
            url: '/users/dashboard',
            templateUrl: 'views/dashboard.html',
            resolve: getToken    
        })
        .state('forgot_password', {
            url: '/users/forgot_password',
            templateUrl: 'views/forgot_password.html',
            controller: 'ForgotPasswordController',
            resolve: getToken
        })
        .state('family_friends', {
            url: '/familyfriends',
            templateUrl: 'views/family_friends.html',
            controller: 'FamilyFriendController',
            resolve: getToken
        })
        .state('my_specialties', {
            url: '/user/specialties',
            templateUrl: 'views/my_specialties.html',
            controller: 'SpecialtyController',
            resolve: getToken
         })
        .state('my_insurances', {
            url: '/user/insurances',
            templateUrl: 'views/my_insurances.html',
            controller: 'InsuranceController',
            resolve: getToken
         })
         .state('my_languages', {
            url: '/user/languages',
            templateUrl: 'views/my_languages.html',
            controller: 'LanguageController',
            resolve: getToken
         })
         .state('my_calender', {
            url: '/user/calendar',
            templateUrl: 'views/my_calender.html',
            controller: 'CalenderController',
            resolve: getToken
        })
        .state('my_favorites', {
            url: '/user/favorites',
            templateUrl: 'views/my_favorites.html',
            controller: 'PatientAppointmentsController',
            resolve: getToken
         })
        .state('update_diseases', {
            url: '/update_spectialty_diseases/:id',
            templateUrl: 'views/updateDiseaseForm.html',
            controller: 'SpecialtyController',
            resolve: getToken
        })
        .state('search', {
            url: '/search?doctor&search_field&specialty_id&city_id&location_id&insurance_id&country_id&language_id&gender_id&page',
            templateUrl: 'views/search.html',
            controller: 'SearchController',
            reloadOnSearch: false,
            resolve: getToken,
        })
        .state('AppointmentSetting', {
            url: '/appointments/settings',
            templateUrl: 'views/appointment_setting.html',
            controller: 'AppointmentsSettingController',
            resolve: getToken
        })
        .state('appointmentModification',{
            url:'/appointments/modifications',
            templateUrl: 'views/appointment_modifications.html',
            controller: 'AppointmentsModificationController',
            resolve: getToken
        })
        .state('appointmentModificationAdd',{
            url:'/appointments/modifications/add',
            templateUrl: 'views/appointment_modifications_add.html',
            controller:'AppointmentsModificationController',
            resolve: getToken
        })
        .state('appointmentModificationDelete',{
            url:'/appointments/modifications/delete/{id}',
            controller:'AppointmentsModificationController',
            resolve: getToken
        })
        .state('appointmentModificationEdit',{
            url:'/appointments/modifications/edit/{id}',
            templateUrl: 'views/appointment_modifications_edit.html',
            controller:'AppointmentsModificationController',
            resolve: getToken
        })
        .state('Appointments', {
            url: '/appointments/{type}?page&appointment_date&branch_id',
            templateUrl: 'views/appointment_index.html',
            controller: 'AppointmentsController',
            resolve: getToken
        })
        .state('MyAppointments', {
            url: '/appointments/today?page',
            templateUrl: 'views/appointment_index.html',
             resolve: getToken
        })
        .state('AppointmentDetail', {
            url: '/appointment/{id}',
            templateUrl: 'views/appointment_view.html',
            controller: 'AppointmentsController',
            resolve: getToken
        })
        .state('AppointmentViewDetail', {
            url: '/appointment/{id}/{appointment_token}',
            templateUrl: 'views/appointment_view.html',
            controller: 'AppointmentsController',
            resolve: getToken
        })
        .state('MyPermissions', {
            url: '/permissions',
            templateUrl: 'views/permissions.html',
             resolve: getToken
        })
        .state('ManageAppointments', {
            url: '/appointments/{branch_id}/{clinic_user_id}/manage/{type}?appointment_date&provider_user_id&page',
            templateUrl: 'views/manage_appointments.html',
            resolve: getToken
        })
        .state('ManageDoctors', {
            url: '/doctors/{branch_id}/{clinic_user_id}/manage',
            templateUrl: 'views/manage_doctors.html',
            resolve: getToken
        })
        .state('ManageAccounts', {
            url: '/accounts/{branch_id}/{clinic_user_id}/manage',
            templateUrl: 'views/manage_accounts.html',
            resolve: getToken
        }) 
        .state('doctor_dashboard', {
            url: '/doctor/{branch_id}/{clinic_user_id}/book_appointment',
            templateUrl: 'views/subaccount_doctor_dashboard.html',
            controller: 'DoctorDashboardController',
            resolve: getToken
        })
        .state('MyLabTests', {
            url: '/mylabtests/{type}?page&appointment_date',
            templateUrl: 'views/my_labtests.html',
            controller: 'LabTestsController',
            resolve: getToken
        })
        .state('money_transfer_account', {
            url: '/users/money_transfer_account',
            templateUrl: 'views/money_transfer_account.html',
            resolve: getToken
        })
        .state('verify_account', {
            url: '/verify/account', 
            templateUrl: 'views/verify_account.html',
            controller: 'UserVerifyController',
            resolve: getToken
        })
        .state('verify_summary', {
            url: '/verify/proof', 
            templateUrl: 'views/verify_summary.html',
            controller: 'UserVerifyController',
            resolve: getToken
        });
    }) 
    .config(['growlProvider', function(growlProvider) {
        growlProvider.onlyUniqueMessages(true);
        growlProvider.globalTimeToLive(5000);
        growlProvider.globalPosition('top-center');
        growlProvider.globalDisableCountDown(true);
    }])   
    .run(function($rootScope, $location, $window, $cookies, SiteSettings, ConstUserType, $state) {
        $rootScope.settings = {};
        angular.forEach(SiteSettings.data, function (value) {   
                 $rootScope.settings[value.name] = value.value;         
        });
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            if ($location.path() === '/') {
                $rootScope.innerPage = '';
                $rootScope.search_footer = false;
            } else {
                $rootScope.innerPage = 'sub-pages';
                $rootScope.search_footer = false;
            }
            if ($location.path() === '/search') {
                $rootScope.searchPage = 'bottomBanner';
                $rootScope.search_footer = true;
            } else {
                $rootScope.searchPage = '';
                $rootScope.search_footer = false;
            } 
            //jshint unused:false
            var url = toState.name;
            var exception_arr = ['home', 'login', 'register', 'forgot_password', 'pages_view', 'contact', 'users_activation','search','otp_verify','user_view','branch_view','clinic_profile'];
            $rootScope.$broadcast('updateParentCss', {});
            if (url !== undefined) {
                if (exception_arr.indexOf(url) === -1 && ($cookies.get("auth") === null || $cookies.get("auth") === undefined)) {
                    $location.path('/users/login');
                }
            }
            if($rootScope.isAuth && parseInt($rootScope.auth.is_profile_updated) === 0 && parseInt($rootScope.auth.role_id) === ConstUserType.User && toState.name !== 'user_profile' && url !== 'users_logout') {
                var redirectto = $location.absUrl().split('/');
                redirectto = redirectto[0] + '/users/edit_profile';
                window.location.href = redirectto;
            }
        });
        $rootScope.$on('$viewContentLoaded', function() {
            $('div.loader')
                .hide();
            $('body')
                .removeClass('site-loading');
        });
        $rootScope.$on('$stateChangeSuccess', function() {
            $('html, body')
                .stop(true, true)
                .animate({
                    scrollTop: 0
                }, 600);
        });
        var query_string = $location.search()
            .action;
        if (query_string !== '') {
            $('html, body')
                .stop(true, true)
                .animate({
                    scrollTop: 0
                }, 450);
        }
    })
    .config(function(cfpLoadingBarProvider) {
        // true is the default, but I left this here as an example:
        cfpLoadingBarProvider.includeSpinner = false;
    })
    .factory('interceptor', ['$q', '$location', 'flash', '$window', '$timeout', '$rootScope', '$filter', '$cookies', function($q, $location, flash, $window, $timeout, $rootScope, $filter, $cookies) {
        return {
            // On response success
            response: function(response) {
                $rootScope.isOn404 = false;
                if (response.status === 200) {
                    $rootScope.isOn404 = false;
                    $('.main_div')
                        .css('display', 'block');
                    $('.js-404-div-open')
                        .css('display', 'none');
                }
                if (angular.isDefined(response.data)) {
                    if (angular.isDefined(response.data.error) && parseInt(response.data.error.code) === 1 && response.data.error.message === 'Authentication failed') {
                        flash.set('Authentication failed. Pls try again later.', 'error', false);
                    }
                    if (angular.isDefined(response.data.thrid_party_login)) {
                        if (angular.isDefined(response.data.error)) {
                            if (angular.isDefined(response.data.error.code) && parseInt(response.data.error.code) === 0) {
                                $cookies.put('auth', JSON.stringify(response.data.user), {
                                    path: '/'
                                });
                                /* $timeout(functspecialtiesion() {
                                     location.reload(true);
                                 });*/
                            } else {
                                var flashMessage;
                                flashMessage = $filter("translate")("Please choose different E-mail.");
                                flash.set(flashMessage, 'error', false);
                            }
                        }
                    }
                }
                // Return the response or promise.
                return response || $q.when(response);
            },
            // On response failture
            responseError: function(response) {
                $timeout(function() {
                    if (response.status === 404) {
                        $rootScope.isOn404 = true;
                        $('.main_div')
                            .css('display', 'none');
                    }
                }, 500);
                $timeout(function() {
                    if (response.status === 404) {
                        $rootScope.isOn404 = true;
                        $('.js-404-div-open')
                            .css('display', 'block');
                    }
                }, 500);
                // Return the promise rejection.
               if (response.status === 401) {
          if ($cookies.get("auth") !== null && $cookies.get("auth") !== undefined) {
            var auth = JSON.parse($cookies.get("auth"));
            var refresh_token = auth.refresh_token;
            if (refresh_token === null || refresh_token === '' || refresh_token === undefined) {
                $cookies.remove('auth', {
                        path: '/'
                    });
                $cookies.remove('token', {
                        path: '/'
                    });
                    //var redirectto = $location.absUrl().split('/#!/');
                var redirectto = $location.absUrl()
                        .split('/');
                    redirectto = redirectto[0] + '/users/login';
                    $rootScope.refresh_token_loading = false;
                    window.location.href = redirectto;
                } else {
                    if ($rootScope.refresh_token_loading !== true) {
                        $rootScope.$broadcast('useRefreshToken');
                    }
                }
                } else {
                  $cookies.remove('auth', {
                    path: '/'
                  });
                $cookies.remove('token', {
                    path: '/'
                });
                    $location.path('/users/login');
                  }
                }
                return $q.reject(response);
            }
        };
    }])
    //jshint ignore:line
    .filter('nl2br', function() {
        var span = document.createElement('span');
        return function(input) {
            if (!input) {
                return input;
            }
            var lines = input.split('\n');
            for (var i = 0; i < lines.length; i++) {
                span.innerText = lines[i];
                span.textContent = lines[i]; //for Firefox
                lines[i] = span.innerHTML;
            }
            return lines.join('<br />');
        };
    })
    .directive("scroll", function ($window) {
        return function (scope) {
            angular.element($window).bind("scroll", function () {
                if (this.pageYOffset >= 100) {
                    scope.boolChangeClass = true;
                } else {
                    scope.boolChangeClass = false;
                }
                scope.$apply();
            });
        };
    })
    .directive('yearSelect', function() {
        return {
            restrict: 'EA',
            replace: true,
            template: '<select ng-options="y for y in years" class="form-control"><option value=""> Choose year </option></select>',
            scope: {
                start: '=',
                end: '=',
            },
            link: function(scope) {
                scope.years = [];
                var i;
                for(i=parseInt(scope.start); i <= parseInt(scope.end); i++){
                    scope.years.push(parseInt(i));
                }
                scope.years.reverse();
            }
        };
    })
    /**
     * @ngdoc filter
     * @name Abs.filter:html
     * @description
     * It returns the filtered html data.
     */
    .filter('html', function ($sce) {
        return function (val) {
            return $sce.trustAsHtml(val);
        };
    })
    /**
     * @ngdoc filter
     * @name Abs.filter:html
     * @description
     * It returns the filtered html data.
     */
    .filter('dateFormat', function ($filter) {
        return function (val)
        {
            if (val === null) {
                return "";
            }
            //var dateTime = val.replace(/(.+) (.+)/, "$1T$2Z");
            var formatedDate = $filter('date')(new Date(val), 'MMM dd, yyyy');
            return formatedDate;
        }; 
    })
    .filter('mediumDate', function ($filter) {
        return function (val)
        {
            if (val === null) {
                return "";
            }
            //var dateTime = val.replace(/(.+) (.+)/, "$1T$2Z");
            var formatedDate = $filter('date')(new Date(val), 'MMM - yyyy');
            return formatedDate;
        }; 
    })
    .filter('fullDate', function ($filter) {
        return function (val)
        {
            if (val === null) {
                return "";
            }
            var formatedDate = $filter('date')(new Date(val), 'd MMM, yyyy');
            return formatedDate;
        }; 
    })
    .filter('unsafe', function($sce) {
        return function(val) {
            return $sce.trustAsHtml(val);
        };
    })
    .filter('date_format', function($filter) {
        return function(input, format) {
            return $filter('date')(new Date(input), format);
        };
    })
    .filter('ageFilter', function() {
        function calculateAge(birthday) { // birthday is a date
            var ageDifMs = Date.now() - birthday.getTime();
            var ageDate = new Date(ageDifMs); // miliseconds from epoch
            return Math.abs(ageDate.getUTCFullYear() - 1970);
        }
   
        return function(birthdate) { 
              return calculateAge(birthdate);
        }; 
    })
    .filter('customCurrency', function($rootScope, $filter) {
        var currency_symbol = $rootScope.settings.CURRENCY_SYMBOL;
        return function(input, symbol, fractionSize) {
            if (isNaN(input)) {
                input = symbol + $filter('number')(input, fractionSize || 2);
                return input;
            } else if (currency_symbol) {
                var symbol = symbol || $rootScope.settings.CURRENCY_SYMBOL; //jshint ignore:line
                input = symbol + $filter('number')(input, fractionSize || 2); //jshint ignore:line
                return input;
            } else {
                var symbol = symbol || $rootScope.settings.CURRENCY_CODE; //jshint ignore:line
                input = symbol + $filter('number')(input, fractionSize || 2); //jshint ignore:line
                return input;
            }
        };
    }) //jshint ignore:line
    .filter('splitedShow', function () {
        return function (passValue)
        {
            if (passValue !== null) {
                var splitedValues = passValue.split(',');
                var ulBuild = "";
                $.each(splitedValues, function (i, value) {
                    ulBuild = ulBuild + '<li>' + value + '</li>';
                });
                return ulBuild;
            } else {
                return "";
            }
        };
    });
     