'use strict';
/**
 * @ngdoc function
 * @name abs.controller:QuestionsController
 * @description
 * # QuestionsController
 * Controller of the abs
 */
angular.module('abs')

.controller('QuestionsController', function ($scope, $http, $filter, $state, $rootScope, $location, $timeout, ConstUserType, flash, QuestionFactory, QuestionActionsFactory, SpecialtyList, AnswerFactory, ConstGenders, md5) {
        $scope.ConstUserType = ConstUserType;
        $scope.maxSize = 5;
        $scope.lastPage = 1;
        $scope.itemsPerPage = 20;   
        $scope.currentPage = (angular.isDefined($state.params.page)) ? parseInt($state.params.page) : 1;
        $scope.skipvalue = $scope.itemsPerPage !== undefined ? ($scope.currentPage - 1) * $scope.itemsPerPage : 0;
        $scope.itemsPerPage = $scope.itemsPerPage !== undefined ? $scope.itemsPerPage : 0;
        $scope.loader = true;
        $scope.index = function () {
          $rootScope.pageTitle = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("Questions");
          $timeout(function () {
              $scope.text_box = true;
          }, 1000);
        };
        function getQuestions(params) {
            QuestionFactory.get(params).$promise.then(function(response){
                if (angular.isDefined(response._metadata)) {
                    $scope.currentPage = response._metadata.current_page;
                    $scope.lastPage = response._metadata.last_page;
                    $scope.itemsPerPage = 20;
                    $scope.totalRecords = response._metadata.total;
                    $scope.Perpage = response._metadata.per_page;
                }
                 $scope.dataLength = (response.data.length > 0) ? true : false;
                 $scope.questions = response.data;
                 $scope.loader = false;
                 $scope._metadata = response._metadata;
            });
	    } 
        function getSpecialties() {
            var params = {};
            params.filter = '{"order":"name asc","limit":500,"skip":0}';
            SpecialtyList.get(params).$promise.then(function (response){
                $scope.specialties = response.data;
                $scope.loader = false;
            });
	    } 
        if($state.current.name == 'QuestionList'){
            var params = {};
            params.filter = '{"where":{"user_id":' + $rootScope.auth.id + '},"limit":'+$scope.itemsPerPage+',"skip":'+$scope.skipvalue+',"include":{"0":"specialty"}}';
            getQuestions(params);
        }
        if($state.current.name == 'QuestionAdd'){
             getSpecialties();
        }
        if($state.current.name == 'QuestionEdit'){
            QuestionActionsFactory.get({id:$state.params.id}).$promise.then(function(response){
                $scope.data = response.data;
                $scope.loader = false;
                getSpecialties();
            });
        }
        if($state.current.name == 'QuestionView'){
            var params = {};
            params.filter = '{"where":{"question_id":' + $state.params.id + '},"include":{"0":"question","1":"user.attachment","2":"user.user_profile"}}';
            AnswerFactory.get(params).$promise.then(function(response){
                $scope.answers = response.data;
                $scope.dataLength = (response.data.length > 0) ? true : false;
                $scope.loader = false;
                if (angular.isDefined($scope.answers) && Object.keys($scope.answers)
                            .length > 0) {
                        angular.forEach($scope.answers, function(provider_user,key) {
                            provider_user.user.user_image = (provider_user.user.user_profile.gender_id === ConstGenders.Female) ? 'images/femaledoctor.jpg' : 'images/maledoctor.jpg'; 
                            if (angular.isDefined(provider_user.user.attachment) && provider_user.user.attachment !== null) {
                                provider_user.user.user_image = 'images/small_thumb/UserAvatar/' + provider_user.user.attachment.id + '.' + md5.createHash('UserAvatar' + provider_user.user.attachment.id + 'png' + 'small_thumb') + '.png';
                            }
                            $scope.answers[key].user.user_image = provider_user.user.user_image;
                        });
                }
            });
        }
        $scope.index();
        $scope.questionAdd = function ($valid,data){
            if($valid) {
                data.is_active = 1;
                QuestionFactory.post(data).$promise.then(function (response){
                    if(response.error.code === 0){
                        $state.go('QuestionList');
                        flash.set($filter("translate")("Questions added successfully."), 'success', false);
                    }else{
                        flash.set($filter("translate")("Questions added failure."), 'error', false);
                    }
                });
            }
        }
        $scope.questionUpdate = function ($valid, data) {
            if($valid) {
                var questionData = {};
                questionData.id = $state.params.id;
                questionData.specialty_id = data.specialty_id;
                questionData.question = data.question;
                questionData.is_active = 1;
                QuestionActionsFactory.put(questionData).$promise.then(function(response){
                    if(response.error.code === 0){
                        $state.go('QuestionList');
                        flash.set($filter("translate")("Questions updated successfully."), 'success', false);
                    }else{
                        flash.set($filter("translate")("Questions updated failure."), 'error', false);
                    }
                });
            }    
        }
         $scope.paginate_search = function (element, currentPage) {
            $scope.currentPage = currentPage;
            $location.search('page', currentPage);
            $('html, body').stop().animate({ scrollTop: 0 }, 1000, 'swing', false);
            $timeout(function () {
                getQuestions(params);
            }, 1000);
        };
})
/* For select select box */
.directive('convertToNumber', function() {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, ngModel) {
                ngModel.$parsers.push(function(val) {
                    return val ? parseInt(val, 10) : null;
                });
                ngModel.$formatters.push(function(val) {
                    return val ? '' + val : '';
                });
            }
        };
});