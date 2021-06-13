'use strict';
angular.module('abs')
	.directive('dashboardSettings', function ($filter) {
        return {
            restrict: 'E',
            templateUrl: 'views/dashboard_settings.html',
            link: function (scope) {
                scope.currentDate = $filter('date')(new Date(), 'yyyy-MM-dd');
                if (localStorage.zone === undefined) {
                    localStorage.zone = moment(new Date()).format('Z');
                }
            },
            scope: true
        };
    })
    .directive('subaccountSettings', function() {
      return {
          restrict: 'E',
          templateUrl: 'views/subaccount_settings.html',
          controller: function($window, $rootScope, $state, $location, $scope, UserBranches) {
              var params = {};
              $scope.branches = [];
              params.filter = '{"where":{"user_id":' + $rootScope.auth.id + '},"include":{"0":"branch.city","1":"clinic_user.user_profile"}}';
              UserBranches.get(params).$promise.then(function (response) {
                $scope.userBranches = response.data;
                $rootScope.clinic_name = $scope.userBranches[0].clinic_user.user_profile.display_name;
                angular.forEach($scope.userBranches, function(branchList) {
                    $scope.branches.push({
                            id: branchList.branch.id,
                            branch_user_id: branchList.id,
                            name: branchList.branch.name,
                            city: branchList.branch.city.name
                    });
                    console.log($scope.branches);
                });
            });
          }
      };
  })
    .directive('headerCountries', function() {
      return {
          restrict: 'E',
          templateUrl: 'views/header_countries.html',
          scope: {
              formName: '@formName',
              type: '@type',
          },
          controller: function($window, $rootScope, $state, $location, $scope, Countries, CountriesCity, $timeout) {
              var params = {};
              params.filter = '{"where":{"is_show_in_frontend": 1 }}';
              /* Countries Get */
              $scope.CountriesGet = function() {
                  Countries.get(params, function(response) {
                      if (angular.isDefined(response.data)) {
                          $scope.Countries = response.data;
                      }
                  });
              };
              $scope.CountriesGet();
              /* change Country function*/
              $scope.changeCountry = function(CountryName, CountryId, Countryiso2) {
                  $scope.countryName = CountryName;
                  $scope.CountryId = CountryId;
                  $scope.Countryiso2 = Countryiso2;
                  localStorage.setItem('SelectedCountryId', JSON.stringify(CountryId));
                  localStorage.setItem('SelectedCountryName', CountryName);
                  localStorage.setItem('SelectedCountryIso2', Countryiso2);
                  $scope.Getcities(CountryId);
                  $scope.DefaultCity(); 
                 
              };
              $scope.StorageCountryId = parseInt(localStorage.getItem('SelectedCountryId'));
              $scope.Getcities = function(CountryId) {
                  var cityparams = {};
                  cityparams.filter = '{"where":{"country_id":' + CountryId + '}}';
                  CountriesCity.get(cityparams, function(response) {
                      if (angular.isDefined(response.data) && response.data.length !== 0) {
                          $scope.cities = response.data;
                          $scope.cityId = response.data[0].id;
                      }
                  });
              };
              $timeout(function()
              {
                $scope.DefaultCity = function()
                {
                    localStorage.removeItem('SelectedCity');
                    $timeout(function() {
                    localStorage.setItem('SelectedCity', JSON.stringify($scope.cities[0].id));
                    $scope.selectedCity = $scope.cities[0].id;
                    $window.location.reload();
                    }, 100);
                };
              }, 1000);
            
              
              $scope.ChangeCity = function(cityid) {
                  $scope.selectedCity = cityid;
                  localStorage.setItem('SelectedCity', JSON.stringify($scope.selectedCity));
              };

              $timeout(function() {
                  if (localStorage.getItem('SelectedCity') === null || localStorage.getItem('SelectedCity') === 'undefined') {
                      if ($scope.cities.length !== 0) {
                          localStorage.setItem('SelectedCity', JSON.stringify($scope.cities[0].id));
                      }
                  }
                  if (localStorage.getItem('SelectedCountryId') === null || localStorage.getItem('SelectedCountryId') === 'undefined') {
                      if ($scope.Countries.length !== 0) {
                          localStorage.setItem('SelectedCountryId', JSON.stringify($scope.Countries[1].id));
                          localStorage.setItem('SelectedCountryName', $scope.Countries[1].name);
                          $scope.countryName = $scope.Countries[1].name;
                      }
                  } else {
                      $scope.countryName = localStorage.getItem('SelectedCountryName');
                      $scope.CountryId = localStorage.getItem('SelectedCountryId');
                  }
                  if(localStorage.getItem('SelectedCountryIso2') === null || localStorage.getItem('SelectedCountryIso2') === 'undefined')
                  {
                      localStorage.setItem('SelectedCountryIso2', $scope.Countries[1].iso2);
                      $scope.Countryiso2 = $scope.Countries[1].iso2;
                  }else{
                      $scope.Countryiso2 = localStorage.getItem('SelectedCountryIso2');
                  }
              }, 1000);
              $scope.selectedCity = localStorage.getItem('SelectedCity');
              $scope.Getcities($scope.StorageCountryId);
              $scope.SearchByCity = function(city_id)
              {
                 $state.go('search', {
                    'search_field': 'doctor',
                    'city_id': city_id
                }, {
                    reload: true
                });
              };
          }
      };
  });