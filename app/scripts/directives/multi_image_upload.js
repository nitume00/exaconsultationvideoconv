'use strict';
angular.module('abs')
    .directive('multiImageUpload', function() {
        return {
            restrict: 'E',
            templateUrl: 'views/multi_image_upload.html',
            transclude: true,
            scope: {
                formName: '@formName',
                type: '@type',
                maxSize: '@maxSize',
                required: '@required',
                stepName: '@stepName',
                objectName: '@objectName',
                className: '@className',
                attachments: '@attachments',
            },
            controller: function($window, $rootScope, $state, $location, $scope, Upload, md5) {
                $scope.loader = true;
                $scope.multiple_attachment_files = [];
                var Multiple_attachments = [];
                if ($scope.type === 'preview&Upload') {
                    if ($scope.attachments !== undefined && $scope.attachments !== null && $scope.attachments !== '') {
                        $scope.attachments = JSON.parse($scope.attachments);
                    }
                    if ($scope.attachments.length > 0) {
                        angular.forEach($scope.attachments, function(newvalue) {
                            if (angular.isDefined(newvalue.id) && newvalue.foreign_id !== null) {
                                var hash = md5.createHash(newvalue.class + newvalue.foreign_id + 'png' + 'medium_thumb');
                                newvalue.image = 'images/medium_thumb/' + newvalue.class + '/' + newvalue.foreign_id + '.' + hash + '.png';
                                /*    $scope.multiple_attachment_files*/
                                $scope.multiple_attachment_files.push(newvalue);
                            }
                        });
                    }
                    $scope.loader = false;
                }
                $scope.loader = false;
                
                if($scope.className === 'LabtestReport') {
                    $scope.attachmentClass = 'DiagnosticCenterTestPatientDiagnosticTest';    
                } else {
                    $scope.attachmentClass = $scope.className;
                }
                
                $scope.upload = function(file) {
                    angular.forEach(file, function(file) {
                        Upload.upload({
                                url: '/api/v1/attachments?class='+$scope.attachmentClass,
                                data: {
                                    file: file
                                }
                            })
                            .then(function(response) {
                                if (response.data.error.code === 0) {
                                    $scope.file = file;
                                    /*Preview array*/
                                    $scope.multiple_attachment_files.push({
                                        'image': file
                                    });
                                    /*Updating Details of the image array*/
                                    var obj = {};
                                    obj[$scope.objectName] = response.data.attachment;
                                    Multiple_attachments.push(obj);
                                    $scope.$emit('MulitpleUploader', {
                                        image_uploaded: Multiple_attachments,
                                        type: $scope.type,
                                        step_name: $scope.stepName
                                    });
                                    $rootScope.images = Multiple_attachments;
                                }
                            });
                    });
                };
                /*Deleting  the image*/
                $scope.removeImage = function() {
                    $scope.$emit('MulitpleUploader', {
                        image_uploaded: Multiple_attachments,
                        type: $scope.type,
                        step_name: $scope.stepName
                    });
                };
            }
        };
    });  