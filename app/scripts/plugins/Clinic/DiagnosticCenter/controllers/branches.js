'use strict';
/**
 * @ngdoc function
 * @name abs.controller:BranchesController
 * @description
 * # BranchesController
 * Controller of the abs
 */
angular.module('abs')

.controller('DiagnosticBranchesController', function($state, $rootScope, $scope, $filter, $location, $timeout, flash, SweetAlert, BranchesFactory, BranchesEdit){
    
    $rootScope.pageTitle = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("Branches");
   /**
     * @ngdoc method
     * @name BranchesController.branch
     * @methodOf module.BranchesController
     * @description
     * This method is used to get the clinic branches listing
    */
    $scope.maxSize = 5;
    $scope.lastPage = 1;
    $scope.itemsPerPage = 20;  
    $scope.currentPage = (angular.isDefined($state.params.page)) ? parseInt($state.params.page) : 1;
    $scope.skipvalue = $scope.itemsPerPage !== undefined ? ($scope.currentPage - 1) * $scope.itemsPerPage : 0;
    $scope.itemsPerPage = $scope.itemsPerPage !== undefined ? $scope.itemsPerPage : 0;
    $scope.loader = true;
    $scope.mybranch = function() {
        var params = {};
        params.filter = '{"where":{"clinic_user_id":' + $rootScope.auth.id + '},"include":{"0":"city","1":"state","2":"country"},"limit":'+$scope.itemsPerPage+',"skip":'+$scope.skipvalue+'}';
      
        if($state.params.page === undefined) {
            params.page = 1;
        } else {
            params.page = $state.params.page;
        }  
        BranchesFactory.get(params, function(response) {
           if (response._metadata) {
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
    $scope.mybranch();
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
                   $scope.mybranch();
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
.controller('DiagnosticBranchViewController', function($state, $rootScope, $scope, $filter, $location, $timeout, flash, BranchesEdit, md5, Slug, DiagnosticCenterTestsFactory){
    
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
    //params.filter = '{"where":{"clinic_user_id":' + $rootScope.auth.id + '},"include":{"0":"city","1":"country","1":"country"}}';
    params.filter = '{"include":{"0":"clinic_user","1":"branch_doctor","2":"branches_specialty.specialty","3":"branches_insurance.insurance","4":"attachment","5":"branch_doctor.user.user_profile","6":"branch_doctor.user.attachment"}}';
    $scope.loader = true;
    BranchesEdit.get(params, function(response) {
        if (angular.isDefined(response.data)) {
            $scope.branch = response.data;
            $scope.isShown = (response.data.branch_doctor.length > 0) ? true : false;
            $scope.loader = false;
            $scope.images = [];
            $scope.doctors = [];
           // $scope.isFavorite = ($scope.user.user_favorite) ? true : false;
           // $scope.provider_user_id = $scope.user.id; 
            if (angular.isDefined($scope.branch.branch_doctor) && Object.keys($scope.branch.branch_doctor)
                    .length > 0) {
                angular.forEach($scope.branch.branch_doctor, function(branchDoctor, key) {
                        var name = $scope.branch.branch_doctor[key].user.user_profile.first_name +' '+ $scope.branch.branch_doctor[key].user.user_profile.last_name;
                        $scope.branch.branch_doctor[key].user.drname = createSlug(name);
                        if ($scope.branch.branch_doctor[key].user.attachment !== null) {
                            $scope.branch.branch_doctor[key].user.users_avatar_url = 'images/normal_thumb/UserAvatar/' + branchDoctor.user.user_id + '.' + md5.createHash('UserAvatar' + branchDoctor.user.user_id + 'png' + 'normal_thumb') + '.png';
                        } else {
                            $scope.branch.branch_doctor[key].user.users_avatar_url = 'images/default.png';
                        }
                        $scope.branch.branch_doctor.push(branchDoctor);
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
        $scope.GetLabTests($scope.branch.id, $scope.branch.clinic_user_id);
    });
    
    $scope.allPhotos = function () {
            $scope.showPhoto = true;
    };  

    // Get Single message
        $scope.GetLabTests = function(branch_id, diagnostic_center_user_id) {
            var params = {};
            params.filter = '{"where":{"diagnostic_center_user_id":' + diagnostic_center_user_id + ', "branch_id":'+ branch_id +'},"include":{"0":"diagonostic_test_image","1":"lab_test"}}';
            DiagnosticCenterTestsFactory.get(params, function(response) {
                if (angular.isDefined(response.data)) {
                    $scope.labtests = response.data;
                    $scope.testLength = (response.data.length > 0) ? true : false;
                }
                angular.forEach($scope.labtests, function(lab, key) {
                    if ($scope.labtests[key].diagonostic_test_image !== null) {
                        $scope.labtests[key].lab_image = 'images/big_thumb/DiagonosticTest/' + lab.diagonostic_test_image.id + '.' + md5.createHash('DiagonosticTest' + lab.diagonostic_test_image.id + 'png' + 'big_thumb') + '.png';
                    } else {
                        $scope.labtests[key].lab_image = 'images/diagnostic_image.jpg';
                    }
                });
            });
        };

      
});  