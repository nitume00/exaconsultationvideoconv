/*globals $:false */
/* jshint latedef:nofunc */
'use strict';
/**
 * @ngdoc function
 * @name ofosApp.controller:TranslationsController
 * @description
 * # TranslationsController
 * Controller of the getlancerv3
 */
angular.module('abs')
    .controller('TranslationsController', function($scope, $http, $filter, $location, notification, $state, $window, $cookies, TranslationsFactory, TranslationFactory, LanguageFactory) {
       // $scope.translationLanguages = [];

       /* Translation get method */
       $scope.Translactions =function()
       {
        TranslationsFactory.get({filter :'filelist'},function (response) {
            if (angular.isDefined(response)) {
                if (response.error.code === 0) {
                        $scope.translationLanguages = response.data;
                    }
            }
        });
       };
       $scope.Translactions();
      /* Update the translation text function */
        $scope.languageAction = function(code) {
             $state.go('translation_edit', {
                 lang_code : code 
                });
        };
          $scope.loader = true;
          TranslationsFactory.get({lang_code: $state.params.lang_code}, function (response) {
          if (angular.isDefined(response)) {
              if (response.error.code === 0) {
                  $scope.translations = response.data;  
                   angular.forEach($scope.translations, function(translation) {
                    translation.tmp_label = translation.label;
                    });
                  }else{
                      $scope.NoRecordFound = true;
                  }
                }
                 $scope.loader = false;
            }); 
      /*  language text change function */
     $scope.translation = {};
     $scope.data = {};
      $scope.data.keyword = [];
        $scope.UpdateLanuageText =function($index)
        {
          var obj = {};
           angular.forEach($scope.translations, function(translat) {
            var label = translat.label
                obj[label] =  translat.lang_text;
            });
        $scope.data.keyword.push(obj);
         /* update transltion factory*/
            TranslationFactory.put({lang_code : $state.params.lang_code}, $scope.data, function(response) {
            if (angular.isDefined(response.error.code === 0)) {
                notification.log('Translations text updated successfully', {
                        addnCls: 'humane-flatty-success'
                    });
                     $scope.Translactions();
                     $state.go('translations');
                }else{
                     notification.log('Translations text could not be updated. Please, try again.', {
                        addnCls: 'humane-flatty-error'
                    });
                     $scope.Translactions();
                }
            }); 
          };
          /*languages get method*/
           LanguageFactory.get(function (response) {
               if (angular.isDefined(response)) {
                    if (response.error.code === 0) {
                        $scope.languageList = response.data;
                        }
                   }
            });

          /*  languages add function*/

            $scope.languagetranslationAdd = function(value)
            {
                $scope.data = {};
                $scope.data.lang_code = $scope.languageTo; 
                TranslationsFactory.post($scope.data, function (response) {
                if (angular.isDefined(response.error.code === 0)) {
                    notification.log('New Translation language has been added successfully.', {
                            addnCls: 'humane-flatty-success'
                        });
                        $location.path('/translations/all');
                    }else{
                        notification.log('Translation language could not be added. Please, try again.', {
                            addnCls: 'humane-flatty-error'
                        });
                    }
                }); 
            }

           /* Add new text function*/
           $scope.addNewText = function($valid)
           {
                $scope.adddata = {};
                $scope.adddata.keyword = [];
                $scope.addEngData = {};
                $scope.addEngData.keyword = [];
                /*keyword array push method for abrabic*/
                    var addobj = {};
                    var addlabel = $scope.original_value;
                    addobj[addlabel] =  $scope.arabic_value;                     
                        $scope.adddata.keyword.push(addobj);
                /*keyword array push for english*/
                 var addengobj = {};
                   // var addlabel = addlabel;
                    addengobj[$scope.original_value] =  $scope.original_value;                     
                        $scope.addEngData.keyword.push(addengobj);
                 /* translation put method*/  
                 if($valid === true)
                 {
                    TranslationFactory.put({lang_code : 'en'}, $scope.addEngData, function(response) {
                     });    
                    TranslationFactory.put({lang_code : 'ar'}, $scope.adddata, function(response) {
                        if (angular.isDefined(response.error.code === 0)) {
                            notification.log('New Text added successfully', {
                                    addnCls: 'humane-flatty-success'
                                });
                                $scope.Translactions();
                                $state.go('translations');
                            }else{
                                notification.log('Text could not be added. Please, try again.', {
                                    addnCls: 'humane-flatty-error'
                                });
                                $scope.Translactions();
                            }
                        });  
                      }  
                 };
      });  