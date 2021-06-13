'use strict';
/**
 * @ngdoc function
 * @name eprescriptionApp.controller:TransactionController
 * @description
 * # TransactionController
TransactionController * Controller of the getlancerv3
 */
angular.module('abs')
    .controller('StockController', function($scope, $http, $filter, $state) {
        $scope.currentPage = 1;
        /**
         * @ngdoc method
         * @name JobsAddController.clear
         * @methodOf module.JobsAddController
         * @description
         * This method is used for clear the date
         */
        $scope.clear = function() {
            $scope.dt = null;
        };
        $scope.inlineOptions = {
            customClass: getDayClass,
            minDate: new Date(2001, 12, 31),
            showWeeks: true
        };
        $scope.dateOptions = {
            formatYear: 'yy',
            maxDate: new Date(2020, 12, 31),
            minDate: new Date(2001, 12, 31),
            startingDay: 1
        };

        function toggleMin() {
            $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date(2001, 12, 31);
            $scope.dateOptions.minDate = new Date(2001, 12, 31);
        };
        toggleMin();
        $scope.open1 = function() {
            $scope.popup1.opened = true;
        };
        $scope.open2 = function() {
            $scope.popup2.opened = true;
        };
        /**
         * @ngdoc method
         * @name JobsAddController.formats
         * @methodOf module.JobsAddController
         * @description
         * This method is used for format the date.
         */
        $scope.formats = ['yyyy-MM-dd'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = $scope.formats[0];
        $scope.popup1 = {
            opened: false
        };
        $scope.popup2 = {
            opened: false
        };
        /**
         * @ngdoc method
         * @name JobsAddController Filter
         * @description
         * This method is used for diplay the custom filter form.
         */
        $scope.customDateForm = function() {
            var dateHide = angular.element(document.getElementsByClassName('js-date'));
            if (dateHide.hasClass('hide')) {
                dateHide.removeClass('hide');
            } else {
                dateHide.addClass('hide');
            }
            $scope.getStocks();
        };
        /**
         * @ngdoc method
         * @name JobsAddController Filter
         * @description
         * This method is used for submit the custom filter form.
         */
        $scope.filterDate = function(valid) {
            if (valid) {
                $scope.from_date = $filter('date')($scope.from_date, "yyyy-MM-dd");
                $scope.to_date = $filter('date')($scope.to_date, "yyyy-MM-dd");
                var dateHide = angular.element(document.getElementsByClassName('js-date'));
                dateHide.addClass('hide');
                $scope.getStocks('custom', $scope.from_date, $scope.to_date);
            }
        };
        $scope.getStocks = function(type, from, to) {
            if (type === 'all') {
                $state.go('stocks', {}, {
                    reload: true
                });
            }
            $http.get(admin_api_url + 'api/v1/stocks?page=' + $scope.currentPage + '&type=' + type + '&from_date=' + from + '&to_date=' + to, {})
                .success(function(response) {
                    var params = {};
                    params.page = $scope.currentPage;
                    if (angular.isDefined(response._metadata)) {
                        $scope.totalItems = response._metadata.total;
                        $scope.itemsPerPage = response._metadata.per_page;
                        $scope.noOfPages = response._metadata.last_page;
                    }
                    $scope.total_qty = 0;
                    $scope.total_sold_qty = 0;
                    $scope.total_stock = 0;
                    $scope.total_stock_sell_price = 0;
                    $scope.total_stock_purchase_price = 0;
                    console.log(response.data);
                    angular.forEach(response.data, function(value) {
                        $scope.total_qty = parseInt($scope.total_qty) + parseInt(value.quantity);
                        $scope.total_sold_qty = parseInt($scope.total_sold_qty) + parseInt(value.sold_quantity);
                        $scope.total_stock = parseInt($scope.total_stock) + parseInt(value.stock);
                        $scope.total_stock_sell_price = parseInt($scope.total_stock) * parseInt(value.medicine.sell_price);
                        $scope.total_stock_purchase_price = parseInt($scope.total_stock) * parseInt(value.medicine.manufacturer_price);
                    });
                    $scope.stocks = response.data;
                }, function(error) {});
        };
        $scope.getStocks();
        $scope.paginate_transaction = function() {
            $scope.getStocks();
        };
        /**
         * @ngdoc method
         * @name JobsAddController.getDayClass
         * @methodOf module.JobsAddController
         * @description
         * This method is used for datepicker plugin.
         */
        function getDayClass(data) {
            var date = data.date,
                mode = data.mode;
            if (mode === 'day') {
                var dayToCheck = new Date(date)
                    .setHours(0, 0, 0, 0);
                for (var i = 0; i < $scope.events.length; i++) {
                    var currentDay = new Date($scope.events[i].date)
                        .setHours(0, 0, 0, 0);
                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }
            return '';
        }
    });