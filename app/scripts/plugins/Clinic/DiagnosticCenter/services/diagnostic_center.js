'use strict';
/**
 * @ngdoc service
 * @name abs.QuoteServicesFactory
 * @description
 * # QuoteServicesFactory
 * Factory in the abs.
 */ 
angular.module('abs')
   .factory('LabTestsFactory', ['$resource', function($resource) {
        return $resource('/api/v1/lab_tests', {}, {
            get: {
                method: 'GET'
            } 
         });
    }])
    .factory('LabTestsGetFactory', ['$resource', function($resource) {
        return $resource('/api/v1/lab_tests/:id', {id: '@id'}, {
            get: {
                method: 'GET'
            } 
         });
    }])
    .factory('DiagnosticCenterTestsFactory', ['$resource', function($resource) {
        return $resource('/api/v1/diagnostic_center_tests', {}, {
            get: {
                method: 'GET'
            },
            post: {
                method: 'POST'
            } 
         });
    }])
    .factory('LabTestReport', ['$resource', function($resource) {
        return $resource('/api/v1/diagnostic_center_tests_patient_diagnostic_tests/:id', {
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
    .factory('LabTestAppointmentView', ['$resource', function($resource) {
        return $resource('/api/v1/patient_diagnostic_tests/:id', {id: '@id'}, {
            get: {
                method: 'GET'
            },
            put: {
                method: 'PUT'
            }
         });
    }])
    .factory('DiagnosticCenterTestsEdit', ['$resource', function($resource) {
        return $resource('/api/v1/diagnostic_center_tests/:id', {
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
    .factory('RemoveTest', ['$resource', function($resource) {
        return $resource('/api/v1/diagnostic_center_tests/:id', {
            id: '@id'
        }, {
            delete: {
                method: 'DELETE'
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
    .factory('DiagnosticLabTestsFactory', ['$resource', function($resource) {
        return $resource('/api/v1/patient_diagnostic_tests', {}, {
            get: {
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
   .factory('DiagnosticBookingAdd', ['$resource', function($resource) {
        return $resource('/api/v1/patient_diagnostic_tests', {}, {
            post: {
                method: 'POST'
            }
        });
   }])
   .factory('PatientBookingLogs', ['$resource', function($resource) {
        return $resource('/api/v1/patients_booking_log', {}, {
            get: {
                method: 'GET'
            }
        });
   }]);   