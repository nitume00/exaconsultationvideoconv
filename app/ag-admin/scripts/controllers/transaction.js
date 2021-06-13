'use strict';
/**
 * @ngdoc function
 * @name abs.controller:TransactionController
 * @description
 * # TransactionController
TransactionController * Controller of the getlancerv3
 */
angular.module('abs')
    .controller('TransactionController', function($scope, $http, $filter, notification, $state, $window, $cookies, TransactionAdminMessage, ConstTransactionType) {
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
            $scope.getTransactions();
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
                $scope.getTransactions('custom', $scope.from_date, $scope.to_date);
            }
        };
        $scope.getTransactions = function(type, from, to) {
            if (type === 'all') {
                $state.go('transactions', {}, {
                    reload: true
                });
            }
            $scope.TransactionAdminMessage = TransactionAdminMessage;
            $http.get(admin_api_url + 'api/v1/transactions?filter={"include":{"0":"user","1":"other_user","2":"foreign_transaction","3":"payment_gateway","4":"provider_user","5":"branch"},"skip":' + (($scope.currentPage * 10) - 10) + ',"limit":' + 10 + ',"order":"id desc"}&type=' + type + '&from_date=' + from + '&to_date=' + to, {})
                .success(function(response) {
                    var params = {};
                    params.page = $scope.currentPage;
                    if (angular.isDefined(response._metadata)) {
                        $scope.totalItems = response._metadata.total;
                        $scope.itemsPerPage = response._metadata.per_page;
                        $scope.noOfPages = response._metadata.last_page;
                    }
                    angular.forEach(response.data, function(value) {
                        var trans = value.transaction_type;
                        var exam = {};
                        var project = {};
                        var job = {};
                        var subscription = {};
                        $scope.transaction_messages = $scope.TransactionAdminMessage[parseInt(trans)];
                        if (angular.isDefined(value.exam)) {
                            exam = value.exam.title;
                        }
                        if (angular.isDefined(value.project)) {
                            project = value.project.name;
                        }
                        if (angular.isDefined(value.job)) {
                            job = value.job.name;
                        }
                        if (angular.isDefined(value.creditPurchasePlan)) {
                            subscription = value.creditPurchasePlan.name;
                        }
                        var name = {
                            '##FOREIGN_ID##': (value.foreign_transaction !== null) ? value.foreign_transaction.id : '',
                            '##PATIENT_DIGNOSTIC_TEST_ID##': (value.foreign_transaction !== null) ? value.foreign_transaction.id : '',
                            '##USER##': (value.user !== null) ? value.user.username : '',
                            '##OTHERUSER##': (value.other_user !== null) ? value.other_user.username : '',
                            '##PLAN##': (value.foreign_transaction.subscription !== undefined) ? value.foreign_transaction.subscription.name : '' 
                        };
                        value.transaction_message = $scope.transaction_messages.replace(/##FOREIGN_ID##|##USER##|##OTHERUSER##|##PLAN##/gi, function(matched) {
                            return name[matched];
                        });
                    });
                    $scope.transactions = response.data;
                }, function(error) {});
        };
        $scope.getTransactions();
        $scope.paginate_transaction = function() {
            $scope.getTransactions();
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