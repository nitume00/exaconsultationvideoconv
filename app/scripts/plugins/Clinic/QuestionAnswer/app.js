/*globals $:false */
'use strict';
/**
 * @ngdoc overview
 * @name abs
 * @description
 * # abs
 *
 * Main module of the application.
 */
angular.module('abs.Clinic.QuestionAnswer', [
    'ngResource',
    'ngSanitize',
    'satellizer',
    'ngAnimate',
    'ui.router',
    'oitozero.ngSweetAlert',
    'uiSwitch'
])
.config(function($stateProvider, $urlRouterProvider) {
        var getToken = {
            'TokenServiceData': function(TokenService, $q) {
                return $q.all({
                    AuthServiceData: TokenService.promise,
                    SettingServiceData: TokenService.promiseSettings
                });
            }
        };
        $urlRouterProvider.otherwise('/');
        $stateProvider.state('QuestionList', {
                url: '/questions?page',
                templateUrl: 'scripts/plugins/Clinic/QuestionAnswer/views/default/questions.html',
                controller: 'QuestionsController',
                resolve: getToken
            }).state('QuestionAdd', {
                url: '/questions/add',
                templateUrl: 'scripts/plugins/Clinic/QuestionAnswer/views/default/questions_add.html',
				        controller: 'QuestionsController',
                resolve: getToken
            }).state('QuestionEdit', {
                url: '/questions/edit/:id',
                templateUrl: 'scripts/plugins/Clinic/QuestionAnswer/views/default/questions_edit.html',
                controller: 'QuestionsController',
                resolve: getToken
            }).state('QuestionView', {
                url: '/questions/:id/:slug',
                templateUrl: 'scripts/plugins/Clinic/QuestionAnswer/views/default/question_with_answer_view.html',
                controller: 'QuestionsController',
                resolve: getToken
            }).state('AnswersList', {
                url: '/answers?page',
                templateUrl: 'scripts/plugins/Clinic/QuestionAnswer/views/default/answers.html',
			    controller: 'AnswersController',
                resolve: getToken
            }).state('AnswerAdd', {
                url: '/answers/add/:question_id',
                templateUrl: 'scripts/plugins/Clinic/QuestionAnswer/views/default/answer_add.html',
				controller: 'AnswersController',
                resolve: getToken
            }).state('AnswerEdit', {
                url: '/answers/edit/:id',
                templateUrl: 'scripts/plugins/Clinic/QuestionAnswer/views/default/answer_edit.html',
                controller: 'AnswersController',
                resolve: getToken
            }).state('AnswerQuestions', {
                url: '/doctors/answers?page',
                templateUrl: 'scripts/plugins/Clinic/QuestionAnswer/views/default/doctor_questions.html',
                controller: 'AnswersController',
                resolve: getToken
            });
});
