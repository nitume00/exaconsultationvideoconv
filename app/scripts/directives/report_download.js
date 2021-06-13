'use strict';
angular.module('abs')

/**
 * @ngdoc directive
 * @name getlancerBidding.downloadFile
 * @param {object} value
 * @description
 * For download the files process (Resumes, Image). 
 * @author mugundhan_352at15 
 */
.directive('fileDownload', function (md5, $location, $timeout) {
    var directive = {
        restrict: 'EA',
        //replace: true,
        template: '<a href="{{downloadUrl}}" class="cursor" target="_blank"> <span ng-bind-html="downloadlable"></span> </a>',
        scope: {
            attachment: '@',
            downloadlable: '@'
        },
        link: function (scope) {
             $timeout(function(){
                scope.attachment = JSON.parse(scope.attachment);
                var ext = scope.attachment.filename.substr(scope.attachment.filename.lastIndexOf('.')+1).toLowerCase();  
                var download_file = md5.createHash(scope.attachment.class + scope.attachment.id + ext + 'download');
                scope.downloadUrl = $location.protocol() + '://' + $location.host() + '/download/' + scope.attachment.class + '/' + scope.attachment.id + '/' + download_file + '.'+ext;
                scope.downloadlable = '<i class="fa fa-download fa-2x"> </i>' +' '+download_file+ '.'+ext;
                /* For check the download label is undeifed or not to fill the default text */
                if (scope.downloadlable === undefined) {
                    scope.downloadlable = '<i class="fa fa-download fa-2x"> </i>' + ' '+download_file+ '.'+ext;
                } 
           },500);    
        },
    };
    return directive;
});