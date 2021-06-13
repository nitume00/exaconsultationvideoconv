'use strict';
/**
 * @ngdoc function
 * @name abs.controller:BranchesController
 * @description
 * # BranchesController
 * Controller of the abs
 */
angular.module('abs')

.controller('BranchesController', function($state, $rootScope, $scope, $filter, $location, $timeout, flash, SweetAlert, BranchesFactory, BranchesEdit, MyDoctorsFactory){
     $scope.maxSize = 5;
     $scope.lastPage = 1;
     $scope.itemsPerPage = 20; 
       
     $rootScope.pageTitle = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("Branches");

     $scope.currentPage = (angular.isDefined($state.params.page)) ? parseInt($state.params.page) : 1;
     $scope.skipvalue = $scope.itemsPerPage !== undefined ? ($scope.currentPage - 1) * $scope.itemsPerPage : 0;
     $scope.itemsPerPage = $scope.itemsPerPage !== undefined ? $scope.itemsPerPage : 0;
     $scope.myBranches = function() {
        if ($state.current.name === 'my_branches') {
            var params = {};
            params.filter = '{"where":{"user_id":' + $rootScope.auth.id + '},"limit":'+$scope.itemsPerPage+',"skip":'+$scope.skipvalue+',"include":{"0":"branch.city","1":"branch.country","2":"clinic_user.user_profile"}}';
            $scope.loader = true;
            if($state.params.page === undefined) {
                params.page = 1;
            } else {
                params.page = $state.params.page;
            }  
            MyDoctorsFactory.get(params, function(response) {
                if (angular.isDefined(response._metadata)) {
                        $scope.currentPage = response._metadata.current_page;
                        $scope.lastPage = response._metadata.last_page;
                        $scope.itemsPerPage = 20;
                        $scope.totalRecords = response._metadata.total;
                        $scope.Perpage = response._metadata.per_page;
                    }
                if (angular.isDefined(response.data)) {
                    $scope.branches = response.data;
                    $scope.dataLength = (response.data.length > 0) ? true : false;
                }
                    $scope.loader = false;
            });
        }  
    }
     if ($state.current.name === 'my_branches') {
        $scope.myBranches();
      }
   /**
     * @ngdoc method
     * @name BranchesController.branch
     * @methodOf module.BranchesController
     * @description
     * This method is used to get the clinic branches listing
    */
       
     $scope.loader = true;
    $scope.mybranch = function() {
       
        var params = {};
        params.filter = '{"where":{"clinic_user_id":' + $rootScope.auth.id + '},"limit":'+$scope.itemsPerPage+',"skip":'+$scope.skipvalue+',"include":{"0":"city","1":"state"},"order":"id desc"}';
        if($state.params.page === undefined) {
            params.page = 1;
        } else {
            params.page = $state.params.page;
        }  
        BranchesFactory.get(params, function(response) {
          if (angular.isDefined(response._metadata)) {
                    $scope.currentPage = response._metadata.current_page;
                    $scope.lastPage = response._metadata.last_page;
                    $scope.itemsPerPage = 20;
                    $scope.totalRecords = response._metadata.total;
                    $scope.Perpage = response._metadata.per_page;
                }
            if (angular.isDefined(response.data)) {
                $scope.branches = response.data;
                $scope.dataLength = (response.data.length > 0) ? true : false;
            }
             $scope.loader = false;
        });
    };
     if ($state.current.name !== 'my_branches') {
          $scope.mybranch();
      }
  
     /**
     * @ngdoc method
     * @name BranchesController.paginate
     * @methodOf module.BranchesController
     * @description
     * This method is used to get the branch listing
     */
      $scope.paginate_search = function (element, currentPage) {
            $scope.currentPage = currentPage;
            $location.search('page', currentPage);
            $('html, body').stop().animate({ scrollTop: 0 }, 1000, 'swing', false);
            $timeout(function () {
                  if ($state.current.name !== 'my_branches') {
                        $scope.mybranch();
                    }
                  if ($state.current.name === 'my_branches') {
                        $scope.myBranches();
                    }

            }, 1000);
        };
     /**
     * @ngdoc method
     * @name BranchesController.statuschange
     * @methodOf module.BranchesController
     * @description
     * This method is used to status change for the branch 
     */
     $scope.changeStatus = function (branch_id, status) {
            var branchData = {};
            branchData.id = branch_id;
            branchData.is_active = status;
            SweetAlert.swal({
                title: $filter("translate")("Are you sure you want to change the status?"),
                text: "",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: $filter("translate")("OK"),
                cancelButtonText: $filter("translate")("Cancel!"),
                closeOnConfirm: true,
                animation: false,
            }, function (isConfirm) {
                if(isConfirm === true) {
                    BranchesEdit.put(branchData, function (response) {
                        if (response.error.code === 0) {
                            flash.set($filter("translate")("Your doctor has been deleted successfully."), 'success', false);
                            $state.reload();
                        } else {
                            flash.set($filter("translate")("Your doctor couldn't deleted. Please try again."), 'error', false);
                            $state.reload();
                        }
                    });
                }  
            });
    }
})
.controller('BranchViewController', function($state, $rootScope, $scope, $filter, $location, $timeout, flash, BranchesEdit, md5, Slug, ConstGenders){

    $rootScope.pageTitle = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("Branches");
    function createSlug(input) {
       return Slug.slugify(input);
    }
    /**
     * @ngdoc method
     * @name BranchesController.branch
     * @methodOf module.BranchesController
     * @description
     * This method is used to get the branch details
    */
    var params = {};
    params.id = $state.params.id;
    params.filter = '{"include":{"0":"clinic_user","1":"branch_doctor.user.primary_speciality","2":"branches_specialty.specialty","3":"branches_insurance.insurance","4":"attachment","5":"branch_doctor.user.user_profile","6":"branch_doctor.user.attachment", "user_favorites":{"where":{"user_id":'+$state.params.id+'}}}}';
    $scope.loader = true;
    BranchesEdit.get(params, function(response) {
        if (angular.isDefined(response.data)) {
            $scope.branch = response.data;
            $scope.isShown = (response.data.branch_doctor.length > 0) ? true : false;
            $scope.loader = false;
            $scope.images = [];
            $scope.doctors = [];
            $scope.isFavorite = ($scope.branch.user_favorites.length > 0) ? true : false; 
            if (angular.isDefined($scope.branch.branch_doctor) && Object.keys($scope.branch.branch_doctor)
                    .length > 0) {
                angular.forEach($scope.branch.branch_doctor, function(branchDoctor, key) {
                   var provider_user = branchDoctor;
                   provider_user.user_image = (provider_user.user.user_profile.gender_id === ConstGenders.Female) ? 'images/femaledoctor.jpg' : 'images/maledoctor.jpg'; 
                   if (angular.isDefined(provider_user.user.attachment) && provider_user.user.attachment !== null) {
                     provider_user.user_image = 'images/big_thumb/UserAvatar/' + provider_user.user.attachment.id + '.' + md5.createHash('UserAvatar' + provider_user.user.attachment.id + 'png' + 'big_thumb') + '.png';
                   }
                   $scope.branch.branch_doctor[key].user.user_image = provider_user.user_image;     
                });
            }        
            if (angular.isDefined(response.data.attachment) && Object.keys(response.data.attachment)
                    .length > 0) {
                angular.forEach(response.data.attachment, function (value, key) {
                    var small_hash = md5.createHash(value.class + value.id + 'png' + 'small_thumb');
                    var small_thumb= 'images/small_thumb/' + value.class + '/' + value.id + '.' + small_hash + '.png';
                    var medium_hash = md5.createHash(value.class + value.id + 'png' + 'medium_thumb');
                    var medium_thumb= 'images/medium_thumb/' + value.class + '/' + value.id + '.' + medium_hash + '.png';
                    $scope.images.push({
                        thumb: small_thumb,
                        img: medium_thumb
                    });
                });
            }       
            $scope.branchImages = $scope.images;
        }
    });
    
    $scope.allPhotos = function () {
            $scope.showPhoto = true;
    };  
      
})
.directive("owlCarouselBranch", function() {
        return {
            restrict: 'E',
            transclude: false,
            link: function(scope) {
                scope.initCarousel = function(element) {
                    var defaultOptions = {
                        responsiveClass: true,
                        margin: 10,
                        responsive: {
                            0: {
                                items: 1,
                                nav: true,
                                dots: false,
                            },
                            600: {
                                items: 2,
                                nav: true,
                                dots: false,
                            },
                            1000: {
                                items: 5,
                                nav: true,
                                loop: false,
                                dots: false,

                            }
                        }
                    };
                    $('#branchDoctor').owlCarouselBranch({
                        loop: true,
                        margin: 2,
                        responsiveClass: true,
                        responsive: {
                            0: {
                                items: 1,
                                nav: true,
                                dots: false,
                            },
                            600: {
                                items: 3,
                                nav: true,
                                dots: false,
                            },
                            1000: {
                                items: 5,
                                nav: true,
                                loop: false,
                                dots: false,
                            }
                        }
                    });
                    $(element).owlCarouselBranch(defaultOptions);
                };
            }
        };
    })
    .directive('owlCarouselDoc', [function() {
        return {
            restrict: 'A',
            transclude: false,
            link: function(scope, element) {
                if (scope.$last) {
                    scope.initCarousel(element.parent());
                }
            }
        };
    }]);