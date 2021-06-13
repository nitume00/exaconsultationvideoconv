(function (module) {
    /**
     * @ngdoc controller
     * @name user.controller:MedicalHistoryViewController
     * @description
     *
     * This is dashboard controller. It contains all the details about the user. It fetches the data of the user by using AuthFactory.
     **/
    module.controller('MedicalHistoryViewController', function ($scope, $filter, $rootScope, $state, Flash, SweetAlert, MedicalHistory) {
        var model = this;
        model.init = function () {
            $rootScope.pageTitle = $rootScope.settings['site.name'] + " | " + $filter("translate")("My Diseases");
            $scope.aside = {
                "title": "Title",
                "content": "Hello Aside<br />This is a multiline message!"
            };
            $scope.currentPage = ($scope.currentPage !== undefined) ? parseInt($scope.currentPage) : 1;
            $scope.getMedicalHistory();
        };
        $scope.getMedicalHistory = function () {
           var param = {
                            'page': $scope.currentPage
                        };
             MedicalHistory.get(param).$promise.then(function (response) {
                $scope.histories = response.data;
                $scope._metadata = response.meta.pagination;
                $scope.currentPage = param.page;
                $scope.maxSize = 5;
            });
        };
         /**
         * @ngdoc method
         * @name paginate
         * @methodOf appointments.controller:MedicalHistoryController
         * @description
         *
         * This method will be load pagination the pages.
         **/
        $scope.paginate = function() {
            $scope.currentPage = parseInt($scope.currentPage);
            $scope.getMedicalHistory();
            $('html, body').stop(true, true).animate({
                scrollTop: 0
            }, 600);
        };
        model.init();
    });
}(angular.module("abs.Clinic.MedicalHistory")));