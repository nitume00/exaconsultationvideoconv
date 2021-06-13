'use strict';

require('../views/header.html');
require('../views/footer.html');


angular.module('abs', [
        'ngResource',
        'ui.router.state',
        'ui.router',
        'ui.bootstrap',
        'ngSanitize',
        'satellizer',
        'ngAnimate',
	    'ngCookies',
		'sdk',		
    ])
 
    .config(['$locationProvider', function($locationProvider) {
        $locationProvider.html5Mode(false).hashPrefix('!');
    }])
    .config(function($stateProvider, $urlRouterProvider) {
   
    $urlRouterProvider.otherwise('/');
        $stateProvider.state('home', {
            url: '/',
            templateUrl: '../app/views/home.html',
            controller: 'HomeController',
    
        });


    }) ;


angular.module('abs')
.controller('HomeController', function($scope, $rootScope, $window, $filter, $state, $cookies, $location) {
        $scope.init = function () {
        };

        $scope.radioChecked = function (value) {
            $scope.placeholder= value;
            $scope.doctor= '';
            $scope.clinical_name= '';
        };
        $scope.init();
 
        $scope.specialty_id = null;
        $scope.city_id = null;
        $scope.state_id = null;
        $scope.insurance_id = null;
        $scope.doctor = null;
        $scope.search_field = 'doctor';
        
})
.controller('MainController', function($rootScope, $scope, $window, $cookies, $state, $location, $filter) {
        $rootScope.isAuth = false;
    
        $rootScope.cdate = new Date();
  
		$rootScope.rbchat = function () {
			$state.go('DoctorChat');                      
		};
		$rootScope.rbvideo = function () {
			$state.go('DoctorVideo');                      
		};	
    }
);



     