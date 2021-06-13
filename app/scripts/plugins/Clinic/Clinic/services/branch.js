'use strict';
/**
 * @ngdoc service
 * @name abs.QuoteServicesFactory
 * @description
 * # QuoteServicesFactory
 * Factory in the abs.
 */
angular.module('abs')
   .factory('BranchesFactory', ['$resource', function($resource) {
        return $resource('/api/v1/branches', {}, {
            get: {
                method: 'GET'
            },
            post: {
                method: 'POST'
            }
         });
    }])
   .factory('BranchesEdit', ['$resource', function($resource) {
        return $resource('/api/v1/branches/:id', {
            id: '@id'
        }, {
            get: {
                method: 'GET'
            },
            put: {
                method: 'PUT'
            }
         });
    }])
    .factory('BranchesTimeSlot', ['$resource', function($resource) {
        return $resource('/api/v1/branches/:id/timeslot', {
            id: '@id'
        }, {
            get: {
                method: 'GET'
            }
         });
    }])
    .factory('DoctorsFactory', ['$resource', function($resource) {
        return $resource('/api/v1/branch_doctors', {}, {
            get: {
                method: 'GET'
            },
            post: {
                method: 'POST'
            }
         });
    }])
    .factory('DoctorsEdit', ['$resource', function($resource) {
        return $resource('/api/v1/branch_doctors/:id', {
            id: '@id'
        }, {
            get: {
                method: 'GET'
            },
            put: {
                method: 'PUT'
            }
         });
    }])
    .factory('RemoveDoctor', ['$resource', function($resource) {
        return $resource('/api/v1/branch_doctors/:id', {
            id: '@id'
        }, {
            delete: {
                method: 'DELETE'
            }
        });
    }])
    .factory('MyDoctorsFactory', ['$resource', function($resource) {
            return $resource('/api/v1/branch_doctors', {}, {
                get: {
                    method: 'GET'
                }
            });
   }])
   .factory('SearchDoctors', ['$resource', function($resource) {
        return $resource('/api/v1/users', {}, {
            get: {
                method: 'GET'
            }
         });
    }])
    .factory('SearchUsers', ['$resource', function($resource) {
        return $resource('/api/v1/users', {}, {
            get: {
                method: 'GET'
            }
         });
    }])
    .factory('SearchPatients', ['$resource', function($resource) {
        return $resource('/api/v1/users', {}, {
            get: {
                method: 'GET'
            }
         });
    }])
    .factory('UsersFactory', ['$resource', function($resource) {
        return $resource('/api/v1/branch_users', {}, {
            get: {
                method: 'GET'
            },
            post: {
                method: 'POST'
            }
         });
    }])
    .factory('UsersEdit', ['$resource', function($resource) {
        return $resource('/api/v1/branch_users/:id', {
            id: '@id'
        }, {
            get: {
                method: 'GET'
            },
            put: {
                method: 'PUT'
            }
         });
    }])
    .factory('RemoveUser', ['$resource', function($resource) {
        return $resource('/api/v1/branch_users/:id', {
            id: '@id'
        }, {
            delete: {
                method: 'DELETE'
            }
        });
    }])
    .factory('UserById', ['$resource', function($resource) {
        return $resource('/api/v1/users/:id', {
            id: '@id'
        }, {
            get: {
                method: 'GET'
            }
         });
    }])
    .factory('AppoinmentSettingsService', ['$resource', function($resource) {
        return $resource('/api/v1/appointment_settings/:id', {
                id: '@id'
        }, {
            get :{
                method: 'GET'
            },
            put: {
                method: 'PUT'
            }            
        });
    }])
    .factory('AppoinmentModificationService', ['$resource', function($resource) {
        return $resource('/api/v1/appointment_modifications', {}, {
            'get': {
                method: 'GET'
            },
            'post': {
                method: 'POST'
			}
        });
    }])
    .factory('AppoinmentModifications', ['$resource', function($resource) {
        return $resource('/api/v1/appointment_modifications/:id', {
            id: '@id'
        }, {
            'get': {
                method: 'GET'
            },
            'put':{
                method: 'PUT'
            },
            'getbyid' :{
                method: 'GET'
            },
            'delete': {
                method: 'DELETE'
            }
        });
    }])  
    .factory('ClinicAppointmentFactory', ['$resource', function($resource) {
        return $resource('/api/v1/appointments', {}, {
            'get': {
                method: 'GET'
            }
        });
    }])
    .factory('ClinicAppointmentBookingAdd', ['$resource', function($resource) {
        return $resource('/api/v1/appointments', {}, {
            post: {
                method: 'POST'
            }
        });
}])  
    .factory('AppointmentView', ['$resource', function($resource) {
        return $resource('/api/v1/appointments/:id', {
                id: '@id'
            },
            {
            'get': {
                method: 'GET'
            }
        });
    }])
    .factory('PermissionsFactory', ['$resource', function($resource) {
        return $resource('/api/v1/permissions', {}, {
            get: {
                method: 'GET'
            }
         });
    }])
   .factory('LocationsFactory', ['$resource', function($resource) {
        return $resource('/api/v1/locations', {}, {
            get: {
                method: 'GET'
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
   .factory('InsurancesFactory', ['$resource', function($resource) {
            return $resource('/api/v1/insurances', {}, {
                get: {
                    method: 'GET'
                }
            });
   }])
   .factory('LanguagesFactory', ['$resource', function($resource) {
            return $resource('/api/v1/languages', {}, {
                get: {
                    method: 'GET'
                }
            });
   }])
   .factory('CountriesFactory', ['$resource', function($resource) {
        return $resource('/api/v1/countries', {}, {
            get: {
                method: 'GET'
            }
        });
   }])
   .factory('NewsFeedsFactory', ['$resource', function($resource) {
        return $resource('/api/v1/news_feeds', {}, {
            get: {
                method: 'GET'
            },
            post: {
                method: 'POST'
            }
        });
   }]).factory('NewsFeedsActionsFactory', ['$resource', function($resource) {
        return $resource('/api/v1/news_feeds/:id', {id: '@id'}, {
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
   .factory('AttachementDelete', ['$resource', function($resource){   
       return $resource('/api/v1/attachments/:attachmentId', {attachmentId: '@attachmentId'},
       {
           delete: {
               method: 'DELETE'
           }
       })
   }]);