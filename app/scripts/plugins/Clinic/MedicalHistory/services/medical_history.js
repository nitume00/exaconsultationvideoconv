'use strict';
/**
 * @ngdoc service
 * @name abs.QuoteServicesFactory
 * @description
 * # QuoteServicesFactory
 * Factory in the abs.
 */
angular.module('abs')
    .factory('MedicalHistory', ['$resource', function($resource) {
        return $resource('/api/v1/medical_history', {}, {
            get: {
                method: 'GET'
            },
            post: {
                method: 'POST'
            }
         });
    }])
    .factory('SpecialtiesFactory', ['$resource', function($resource) {
        return $resource('/api/v1/specialties', {}, {
            get: {
                method: 'GET'
            }
         });
    }])
    .factory('MedicalHistoryAction', ['$resource', function($resource) {
        return $resource('/api/v1/medical_history/:id', {id: '@id'}, {
            get: {
                method: 'GET'
            },
            put: {
                method: 'PUT'
            },
            delete: {
                    method: 'DELETE'
            }
         });
    }])
    .factory('MedicalHistoryView', ['$resource', function($resource) {
        return $resource('/api/v1/medical_history/:user_id', {user_id: '@user_id'}, {
            get: {
                method: 'GET'
            } 
         });
    }])
    .factory('MedicalRecordView', ['$resource', function($resource) {
        return $resource('/api/v1/medical_history/:user_id/:specialty_id', {user_id: '@user_id', specialty_id: '@specialty_id'}, {
            get: {
                method: 'GET'
            } 
         });
    }])
   .factory('AttachmentDelete', ['$resource', function($resource) {
        return $resource('/api/v1/attachments/:attachmentId', {attachmentId: '@attachmentId'}, {
            delete: {
                method: 'DELETE'
            }
         });
    }])
    .factory('FormFieldSubmissionForm', ['$resource', function($resource) {
        return $resource('/api/v1/form_field_submissions', {
            get: {
                method: 'GET'
            }
        });
    }])
    .factory('UserSpecialty', ['$resource', function($resource) {
        return $resource('/api/v1/specialties_users', {}, {
            get: {
                method: 'GET'
            }
         });
    }]);    