'use strict';
angular.module('abs')
	.directive('geoLocation', function() {
        return {
            restrict: 'E',
            scope: true,
            controller : function($scope) {
                var options = {
                    types: ['(cities)']
                };
                var autocompleteFrom = new google.maps.places.Autocomplete(document.getElementById('geo-location'), options);
                google.maps.event.addListener(autocompleteFrom, 'place_changed', function() {
                    var place = autocompleteFrom.getPlace();
                    $scope.profileLatitude = place.geometry.location.lat();
                    $scope.model.form_latitude = place.geometry.location.lat();
                    $scope.profileLongitude = place.geometry.location.lng();
                    $scope.model.form_longitude = place.geometry.location.lng();
                    $scope.profileAddress = place.formatted_address;
                    $scope.model.form_address = place.formatted_address;
                    var k = 0;
                    angular.forEach(place.address_components, function(value) {
                        if (value.types[0] === 'locality' || value.types[0] === 'administrative_area_level_2') {
                            if (k === 0) {
                                $scope.cityName = value.long_name;
                            }
                            if (value.types[0] === 'locality') {
                                k = 1;
                            }
                        }
                        if (value.types[0] === 'administrative_area_level_1') {
                            $scope.stateName = value.long_name;
                        }
                        if (value.types[0] === 'country') {
                            $scope.countryName = value.long_name;
                        }
                        if (value.types[0] === 'sublocality_level_1' || value.types[0] === 'sublocality_level_2') {
                            if ($scope.profileAddress !== '') {
                                $scope.profileAddress = $scope.profileAddress + ', ' + value.long_name;
                            } else {
                                $scope.profileAddress = value.long_name;
                            }
                        }        
                        if (value.types[0] === 'postal_code') {
                            $scope.postalCode = parseInt(value.long_name);
                        }
                    });
                });
            },
            template: '<input ng-required=true name="address" class="form-control" id="geo-location" placeholder="Search City"  ng-model="model.form_address">'
        };
   });
