'use strict';
/**
 * @ngdoc function
 * @name abs.controller:BranchesController
 * @description
 * # BranchesController
 * Controller of the abs
 */
angular.module('abs')

.controller('NewsFeedsController', function($state, $rootScope, $scope, $filter, $location, $timeout, flash, ConstUserType, SweetAlert, NewsFeedsFactory, NewsFeedsActionsFactory){
     $scope.index = function () {
         $rootScope.pageTitle = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("News Feeds");
         $timeout(function () {
            $scope.text_box = true;
         }, 1000);
     };
     $scope.index(); 
      $scope.maxSize = 5;
      $scope.lastPage = 1;
      $scope.itemsPerPage = 20;    
      $scope.loader = true;
     function getNewsFeeds(params) 
     {  
        NewsFeedsFactory.get(params).$promise.then(function (response) {
             if (angular.isDefined(response._metadata)) {
                    $scope.currentPage = response._metadata.current_page;
                    $scope.lastPage = response._metadata.last_page;
                    $scope.itemsPerPage = 20;
                    $scope.totalRecords = response._metadata.total;
                    $scope.Perpage = response._metadata.per_page;
                }
            if (angular.isDefined(response.data)) {
                $scope.dataLength = (response.data.length > 0) ? true : false;
                $scope.newsfeeds = response.data;
               /* $scope._metadata = response._metadata;*/
            /*    $scope.currentPage = response._metadata.current_page;*/
                $scope.maxSize = 5;
            }
            $scope.loader = false;
        });
	 } 
     if($state.current.name === 'news_feeds') {
           $scope.currentPage = (angular.isDefined($state.params.page)) ? parseInt($state.params.page) : 1;
           $scope.skipvalue = $scope.itemsPerPage !== undefined ? ($scope.currentPage - 1) * $scope.itemsPerPage : 0;
           $scope.itemsPerPage = $scope.itemsPerPage !== undefined ? $scope.itemsPerPage : 0;
            var params = {};
            params.filter = '{"where":{"user_id":' + $rootScope.auth.id + '},"limit":'+$scope.itemsPerPage+',"skip":'+$scope.skipvalue+'}';
            getNewsFeeds(params);
     } else if($state.current.name === 'news_feeds_add'){
            $rootScope.pageTitle = $rootScope.settings.SITE_NAME + " | " + $filter("translate")("Add News Feeds");
            $scope.newsFeedsAdd = function($valid,data){
                if ($valid) {
                    var newsFeedsData = {};
                    newsFeedsData.user_id = $rootScope.auth.id;
                    newsFeedsData.title = data.title;
                    newsFeedsData.content = data.content;
                    NewsFeedsFactory.post(newsFeedsData).$promise.then(function (response) {
                        if(response.error.code === 0){
                            $state.go('news_feeds');
                            flash.set($filter("translate")("News Feeds added successfully."), 'success', false);
                        }else{
                            flash.set($filter("translate")("FavorNews Feeds failure."), 'error', false);
                        }
                    });
                }    
            };
    } else if($state.current.name === 'news_feeds_edit'){
            $rootScope.pageTitle = $rootScope.settings.SITE_NAME + " | " + $filter("translate")("Edit News Feeds");
            NewsFeedsActionsFactory.get({id: $state.params.id}).$promise.then(function (response) {
                $scope.data = response.data;
            });
            $scope.newsFeedsEdit = function($valid,data){
                if ($valid) {
                    NewsFeedsActionsFactory.put(data).$promise.then(function (response) {
                        if(response.error.code === 0){
                            $state.go('news_feeds');
                            flash.set($filter("translate")("News Feeds updated successfully."), 'success', false);
                        }else{
                            flash.set($filter("translate")("FavorNews Feeds failure."), 'error', false);
                        }
                    });
                }    
            };
    } else if($state.current.name === 'news_feeds_view'){
            $rootScope.pageTitle = $rootScope.settings.SITE_NAME + " | " + $filter("translate")("View News Feeds");
            NewsFeedsActionsFactory.get({id: $state.params.id}).$promise.then(function (response) {
                $scope.newsfeed = response.data;
            });
    }		
    $scope.remove_newsfeeds = function (id) {
            SweetAlert.swal({
                title: $filter("translate")("Are you sure want to remove your news feeds?"),
                text: "",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55", confirmButtonText: $filter("translate")("Yes"),
                cancelButtonText: $filter("translate")("No"),
                closeOnConfirm: true,
                closeOnCancel: true
            },
            function (isConfirm) {
                if (isConfirm) {
                    NewsFeedsActionsFactory.delete({id: id}).$promise.then(function (response) {
                        if(response.error.code === 0){
                            $timeout(function(){
                                $state.go('news_feeds', {}, { reload:true });  
                            },500); 
                            flash.set($filter("translate")("News Feeds deleted successfully."), 'success', false);
                        }else{                        
                            flash.set($filter("translate")("News Feeds deleted failure."), 'error', false);
                        }
                    });
                }
            });
        }
        $scope.paginate_search = function (element, currentPage) {
            $scope.currentPage = currentPage;
            $location.search('page', currentPage);
            $('html, body').stop().animate({ scrollTop: 0 }, 1000, 'swing', false);
            $timeout(function () {
                /*$scope.search(element);*/
                getNewsFeeds(params);
            }, 1000);
        };
})
.filter('removeHTMLTags', function () { //removeHTMLTags is the filter name
    return function (text) {
       return text ? String(text).replace(/<[^>]+>/gm, '') : ''; // used regular expression
    };
});