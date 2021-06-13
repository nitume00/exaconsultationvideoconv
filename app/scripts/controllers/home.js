'use strict';
/**
 * @ngdoc function
 * @name abs.controller:HomeController
 * @description
 * # HomeController
 * Controller of the abs
 */
angular.module('abs')
.controller('HomeController', function($scope, $rootScope, $window, $filter, $state, $timeout, $cookies, $location,$uibModal,Slug, md5) {
        $scope.init = function () {
        };

        $scope.radioChecked = function (value) {
            $scope.placeholder= value;
            $scope.doctor= '';
            $scope.clinical_name= '';
        };
        $scope.init();
        $scope.ConstUserType = ConstUserType;
        $scope.specialty_id = null;
        $scope.city_id = null;
        $scope.state_id = null;
        $scope.insurance_id = null;
        $scope.doctor = null;
        $scope.search_field = 'doctor';
        
})
    //Owl corrousel not working in angular.So we are triggering using the below directives 
    //we need to write a individual directive then only owl corrousel will trigger.triggering using element  will not working
    .directive("owlCarousel", function() {
        return {
            restrict: 'E',
            transclude: false,
            link: function(scope) {
                scope.initCarousel = function(element) {
                    // provide any default options you want
                    var defaultOptions = {
                        responsiveClass: true,
                        margin: 10,
                        responsive: {
                            0: {
                                items: 1,
                                nav: true,
                                dots: false,
                            },
                            600: {
                                items: 2,
                                nav: true,
                                dots: false,
                            },
                            1000: {
                                items: 5,
                                nav: true,
                                loop: false,
                                dots: false,

                            }
                        }
                    };
                    $('#popularSpecialty').owlCarousel({
                        loop: true,
                        margin: 2,
                        responsiveClass: true,
                        responsive: {
                            0: {
                                items: 1,
                                nav: true,
                                dots: false,
                            },
                            600: {
                                items: 3,
                                nav: true,
                                dots: false,
                            },
                            1000: {
                                items: 5,
                                nav: true,
                                loop: false,
                                dots: false,
                            }
                        }
                    });
                    $('#popularClinic').owlCarousel({
                        loop: true,
                        margin: 2,
                        responsiveClass: true,
                        responsive: {
                            0: {
                                items: 1,
                                nav: true,
                                dots: false,
                            },
                            600: {
                                items: 3,
                                nav: true,
                                dots: false,
                            },
                            1000: {
                                items: 5,
                                nav: true,
                                loop: false,
                                dots: false,
                            }
                        }
                    });
                     $('#clinicView').owlCarousel({
                        loop: true,
                        margin: 2,
                        responsiveClass: true,
                        responsive: {
                            0: {
                                items: 3,
                                nav: true,
                                dots: false,
                            },
                            600: {
                                items: 4,
                                nav: true,
                                dots: false,
                            },
                            1000: {
                                items: 3,
                                nav: true,
                                loop: false,
                                dots: false,
                            }
                        }
                    });
                    $(element).owlCarousel(defaultOptions);
                };

            }
        };
    })
    .directive('owlCarouselItem', [function() {
        return {
            restrict: 'A',
            transclude: false,
            link: function(scope, element) {
                if (scope.$last) {
                    scope.initCarousel(element.parent());
                }
            }
        };
    }]);