'use strict';
/**
 * @ngdoc function
 * @name abs.controller:ContactsController
 * @description
 * # ContactsController
 * Controller of the abs
 */
angular.module('abs')

    /**
     * @ngdoc directive
     * @name contacts.directive:contactLinks
     * @scope
     * @restrict AE
     *
     * @description
     * contactLink directive creates a contact link. We can use this as an element.
     *
     * @param {string} googleAnalytics Name of the directive
     *
     **/
    .directive('contactLinks', function () {
        var linker = function (scope, element, attrs) {
            // do DOM Manipulation here
        };
        return {
            restrict: 'A',
            replace: true,
            templateUrl: 'scripts/plugins/Common/Contacts/views/default/contact_links.html',
            link: linker,
            controller: 'ContactUsController',
            bindToController: true
        };
    })
    /**
     * @ngdoc controller
     * @name contacts.controller:ContactUsController
     * @description
     *
     * This is contactUs controller having the methods init(), setMetaData(), and contactFormSubmit().
     *
     * It controls the functionality of contact us.
     **/
    .controller('ContactUsController', function ($scope, $rootScope, ContactsFactory, $filter, flash, $state, $location, vcRecaptchaService) {
        /**
         * @ngdoc method
         * @name init
         * @methodOf contacts.controller:ContactUsController
         * @description
         * This method will initialze the page. It returns the page title.
         *
         **/
        $scope.init = function () {
            $rootScope.pageTitle = $rootScope.settings['site.name'] + " | " + $filter("translate")("Contact Us");
        };
        $scope.init();
        /**
         * @ngdoc method
         * @name contactFormSubmit
         * @methodOf contacts.controller:ContactUsController
         * @description
         * This method handles the form which is used for contact.
         *
         **/
        $scope.contactFormSubmit = function () {
            $scope.emailErr = '';
            $scope.captchaErr = '';
            if (vcRecaptchaService.getResponse() === "") { //if string is empty
                $scope.captchaErr = $filter("translate")("Please resolve the captcha and submit");
            } else {
                $scope.contactForm.recaptcha_response = vcRecaptchaService.getResponse();
                ContactsFactory.post($scope.contactForm).$promise.then(function (response) {
                    flash.set($filter("translate")("Thank you for contacting us."), 'success', true);
                    $scope.contactForm = {};
                    $scope.contactFormAdd.$setPristine();
                    $scope.contactFormAdd.$setUntouched();
                }, function (error) {
                    var errMsg = error.data.errors;
                    if (errMsg.email) {
                        $scope.emailErr = $filter("translate")(errMsg.email[0]);
                    }
                    flash.set($filter("translate")("Please try again later"), 'error', false);
                });
            }
        };
    });

