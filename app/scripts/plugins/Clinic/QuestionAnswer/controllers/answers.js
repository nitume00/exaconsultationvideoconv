'use strict';
/**
 * @ngdoc function
 * @name abs.controller:QuestionsController
 * @description
 * # QuestionsController
 * Controller of the abs
 */
angular.module('abs')
    .controller('AnswersController', function ($scope, $http, $filter, $state, $rootScope, $location, $timeout, flash, ConstUserType, AnswerFactory, AnswerActionsFactory, QuestionActionsFactory, QuestionFactory, SpecialtyUsers) {

        if ($rootScope.user.role_id === ConstUserType.Doctor && $rootScope.user.is_individual === 1 && $rootScope.user.is_proof_verified === 0) {
            var redirectto = $location.absUrl().split('/');
            redirectto = redirectto[0] + '/verify/proof';
            window.location.href = redirectto;
        }
        var params = {};
        $scope.maxSize = 5;
        $scope.lastPage = 1;
        $scope.itemsPerPage = 20; 
         $scope.currentPage = (angular.isDefined($state.params.page)) ? parseInt($state.params.page) : 1;
         $scope.skipvalue = $scope.itemsPerPage !== undefined ? ($scope.currentPage - 1) * $scope.itemsPerPage : 0;
         $scope.itemsPerPage = $scope.itemsPerPage !== undefined ? $scope.itemsPerPage : 0;
         $scope.loader = true;
        $scope.index = function () {
            $rootScope.pageTitle = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("Answers");
            $timeout(function () {
              $scope.text_box = true;
            }, 1000);
        };
        function getAnswers() {
            var params = {};
            params.filter = '{"where":{"user_id":' + $rootScope.auth.id + '},"limit":'+$scope.itemsPerPage+',"skip":'+$scope.skipvalue+',"include":{"0":"question.specialty"}}';
            AnswerFactory.get(params).$promise.then(function(response){
                if (angular.isDefined(response._metadata)) {
                    $scope.currentPage = response._metadata.current_page;
                    $scope.lastPage = response._metadata.last_page;
                    $scope.itemsPerPage = 20;
                    $scope.totalRecords = response._metadata.total;
                    $scope.Perpage = response._metadata.per_page;
                }
                $scope.answers = response.data;
                $scope.loader = false;
                $scope.dataLength = (response.data.length > 0) ? true : false;
                $scope._metadata = response._metadata;
                $scope.currentPage = response._metadata.current_page;
            });
	    } 
        if($state.current.name == 'AnswersList'){
            getAnswers();
        }
        function getQuestions()
        {   
        if($state.current.name == 'AnswerQuestions'){
            var params = {};
            params.filter = '{"where":{"user_id":' + $rootScope.auth.id + '},"limit":'+$scope.itemsPerPage+',"skip":'+$scope.skipvalue+'}}';
            SpecialtyUsers.get(params).$promise.then(function(response){
                if (angular.isDefined(response._metadata)) {
                    $scope.currentPage = response._metadata.current_page;
                    $scope.lastPage = response._metadata.last_page;
                    $scope.itemsPerPage = 20;
                    $scope.totalRecords = response._metadata.total;
                    $scope.Perpage = response._metadata.per_page;
                }
                $scope.specialty_users = response.data;
                $scope.inq = {};
                var i = 0;
                if (angular.isDefined($scope.specialty_users) && Object.keys($scope.specialty_users)
                    .length > 0) {
                    angular.forEach($scope.specialty_users, function (value) {
                        $scope.inq[i] = value.id;
                        i=i+1;
                    });
                } 
                $scope.inq[i] = $rootScope.auth.primary_speciality_id;
                $scope.temp = JSON.stringify($scope.inq);
                params = {}; 
                params.filter = '{"where":{"specialty_id":{"inq":' + $scope.temp + '}},"include":{"0":"specialty"},"limit":'+$scope.itemsPerPage+',"skip":'+$scope.skipvalue+'}';
                QuestionFactory.get(params).$promise.then(function(response){
                     if (angular.isDefined(response._metadata)) {
                        $scope.currentPage = response._metadata.current_page;
                        $scope.lastPage = response._metadata.last_page;
                        $scope.itemsPerPage = 20;
                        $scope.totalRecords = response._metadata.total;
                        $scope.Perpage = response._metadata.per_page;
                    }
                    $scope.answers = response.data;
                    $scope.loader = false;
                    $scope.dataLength = (response.data.length > 0) ? true : false;
                    $scope._metadata = response._metadata;
                    $scope.currentPage = response._metadata.current_page;
                });
           }); 
        }
        };
        if($state.current.name == 'AnswerQuestions'){
            getQuestions();
        }
       
        if($state.current.name == 'AnswerAdd'){
            QuestionActionsFactory.get({id:$state.params.question_id}).$promise.then(function(response){
                $scope.data = response.data;
            });
        }
        if($state.current.name == 'AnswerEdit'){
            var params = {};
            params.id = $state.params.id;
            params.filter = '{"include":{"0":"question.specialty"}}';
            AnswerActionsFactory.get(params).$promise.then(function(response){
                $scope.data = response.data;
            });
        }
        $scope.index();
        $scope.answerAdd = function($valid, data){
            var answerData = {};
            answerData.question_id = $state.params.question_id;
            answerData.answer = data.answer;
            AnswerFactory.post(answerData).$promise.then(function (response){
                if(response.error.code === 0){
                    $state.go('AnswersList');
                    flash.set($filter("translate")("Answer added successfully."), 'success', false);
                }else{
                    flash.set($filter("translate")("Answer added failure."), 'error', false);
                }
            });
        };
        $scope.answerUpdate = function($valid, data){
            var answerData = {};
            answerData.id = $state.params.id;
            answerData.answer = data.answer;
            AnswerActionsFactory.put(answerData).$promise.then(function (response){
                if(response.error.code === 0){
                    $state.go('AnswersList');
                    flash.set($filter("translate")("Answer updated successfully."), 'success', false);
                }else{
                    flash.set($filter("translate")("Answer updated failure."), 'error', false);
                }
            });
        };
         $scope.paginate_search = function (element, currentPage) {
            $scope.currentPage = currentPage;
            $location.search('page', currentPage);
            $('html, body').stop().animate({ scrollTop: 0 }, 1000, 'swing', false);
            $timeout(function () {
               if($state.current.name == 'AnswerQuestions'){
                   getQuestions();
               }
              if($state.current.name == 'AnswersList'){
                    getAnswers();
                }
            }, 1000);
        };
    });
