'use strict';
/**
 * @ngdoc service
 * @name abs.home
 * @description
 * # cities
 * Factory in the abs.
 */
angular.module('abs')
.factory('usersLogin', ['$resource', function($resource) {
        return $resource('/api/v1/users/login', {}, {
            login: {
                method: 'POST'
            }
        });
}])
.factory('usersRegister', ['$resource', function($resource) {
        return $resource('/api/v1/users/register', {}, {
            create: {
                method: 'POST'
            }
        });
}])
.factory('OtpVerify', ['$resource', function($resource) {
        return $resource('/api/v1/users/:user_id/otp_verify', {user_id: '@user_id'},{
            post:{
                method: 'POST'
            }
        });
}])
.factory('OtpResend', ['$resource', function($resource) {
        return $resource('/api/v1/users/resend_otp/:user_id', { user_id: '@user_id'},{
            get:{
                method: 'GET'
            }
        });
}])    
.factory('usersLogout', ['$resource', function($resource) {
        return $resource('/api/v1/users/logout', {}, {
            logout: {
                method: 'GET'
            }
        });
}])        
.factory('AuthFactory', ['$resource', function($resource) {
        return $resource('/api/v1/users/auth', {}, {
            fetch: {
                method: 'GET'
            }
        });
}])
.factory('providers', ['$resource', function($resource) {
        return $resource('/api/v1/providers', {}, {
            get: {
                method: 'GET'
            }
        });
}])
.factory('UserProfilesFactory', ['$resource', function($resource) {
        return $resource('/api/v1/user_profiles', {}, {
            update: {
                method: 'PUT'
            },
            get: {
                method: 'GET'
            }
        });
}])
.factory('UserViewProfileFactory', ['$resource', function($resource) {
        return $resource('/api/v1/users/:id', { id : '@id'}, {
            get: {
                method: 'GET'
            },
            put: {
                method: 'PUT'
            }
        });
}])
.factory('UserActivateFactory', ['$resource', function($resource) {
        return $resource('/api/v1/users/:id/activate/:hash', { id: '@id', hash: '@hash'}, {
            activate: {
                method: 'GET'
            }
        });
}])
.factory('ForgotPasswordFactory', ['$resource', function($resource) {
    return $resource('/api/v1/users/forgot_password', {}, {
        forgot_password: {
            method: 'POST'
        }
    });
}]) 
.factory('ChangePWd', ['$resource', function($resource) {
        return $resource('/api/v1/users/:id/change_password', {id: '@id'}, {
            put: {
                method: 'PUT'
            }
        });
}]) 
.factory('UserAttachmentFactory', ['$resource', function($resource) {
        return $resource('/api/v1/users/:id/attachment', {id: '@id'}, {
            get: {
                method: 'GET'
            }
        });
}]) 
.factory('Genders', ['$resource', function($resource) {
        return $resource('/api/v1/genders', {}, {
            get: {
                method: 'GET'
            }
        });
}])   
.factory('Language', ['$resource', function($resource) {
        return $resource('/api/v1/languages', {}, {
            languageList: {
                method: 'GET'
            }
        });
}])     
.factory('City', ['$resource', function($resource) {
        return $resource('/api/v1/cities', {}, {
            cityList: {
                method: 'GET'
            }
        });
}])    
.factory('States', ['$resource', function($resource) {
        return $resource('/api/v1/states', {}, {
            stateList: {
                method: 'GET'
            }
        });
}])   
.factory('Country', ['$resource', function($resource) {
        return $resource('/api/v1/countries', {}, {
            get: {
                method: 'GET'
            }
        });
}]) 
.factory('Category', ['$resource', function($resource) {
        return $resource('/api/v1/categories', {}, {
            categoryList: {
                method: 'GET'
            }
        });
}]) 
.factory('FamilyFriends', ['$resource', function($resource) {
        return $resource('/api/v1/family_friends', {}, {
            get: {
                method: 'GET'
            },
		    post:{
                method: 'POST'
            }
        });
}])
.factory('FamilyFriendsEdit', ['$resource', function($resource) {
        return $resource('/api/v1/family_friends/:id', {id: '@id'}, {
            get: {
                method: 'GET'
            },
            put: {
                method: 'PUT'
            },
		    delete:{
                method: 'DELETE'
            }
        });
}])
.factory('MySpecialties', ['$resource', function($resource) {
        return $resource('/api/v1/specialties_users', {}, {
            post: {
                method: 'PUT'
            },
            get: {
                method: 'GET'
            }
        });
}])  
.factory('MyLanguages', ['$resource', function($resource) {
        return $resource('/api/v1/languages_users', {}, {
            post: {
                method: 'PUT'
            },
            get: {
                method: 'GET'
            }
        });
}])     
.factory('MyInsurances', ['$resource', function($resource) {
        return $resource('/api/v1/insurance_companies_users', {}, {
            update: {
                method: 'PUT'
            },
            get: {
                method: 'GET'
            }
        });
}])     
.factory('UserNotification', ['$resource', function($resource) {
        return $resource('/api/v1/users/:id', {id: '@id'}, {
            update: {
                method: 'PUT'
            },
            get: {
                method: 'GET'
            }
        });
}])   
.factory('MyFavorites', ['$resource', function($resource) {
        return $resource('/api/v1/user_favorites', {}, {
            get: {
                method: 'GET'
            }
        });
}])
.factory('FavoriteDelete', ['$resource', function($resource) {
    return $resource('/api/v1/user_favorites/:id', {id:'@id'}, {
            delete: {
                method: 'DELETE'
            }
        }
    );
}])
.factory('MyAppointment', ['$resource', function($resource) {
        return $resource('/api/v1/service/form_fileds/:id', {id: '@id'}, {
            update: {
                method: 'PUT'
            },
            get: {
                method: 'GET'
            }
        });
}])      
.factory('MyLabTestsFactory', ['$resource', function($resource) {
        return $resource('/api/v1/patient_diagnostic_tests', {}, {
            get: {
                method: 'GET'
            }
        });
}])
.factory('UserBranches', ['$resource', function($resource) {
        return $resource('/api/v1/branch_users', {}, {
            get: {
                method: 'GET'
            }
        });
}])
.factory('GetPermissions', ['$resource', function($resource) {
        return $resource('/api/v1/branch_users/:id', {id: '@id'}, {
            get: {
                method: 'GET'
            }
        });
}])
.factory('BranchAppointmentLogs', ['$resource', function($resource) {
        return $resource('/api/v1/branch_appointment_logs', {}, {
            get: {
                method: 'GET'
            }
        });
}])
.factory('PatientsBookingLogs', ['$resource', function($resource) {
        return $resource('/api/v1/patients_booking_log', {}, {
            get: {
                method: 'GET'
            }
        });
}])
.factory('ProfileSearchList', ['$resource', function($resource) {
        return $resource('/api/v1/search/getdoctorweeklist/:userids/:viewslot', { userids:'@userids',viewslot:'@viewslot'}, {
            get: {
                method: 'GET'
            }
        });
}])        
.factory('AppointmentWeekList', ['$resource', function($resource) {
        return $resource('/api/v1/appointment_settings/:apt_set_id/slot', { apt_set_id:'@apt_set_id'}, {
            get: {
                method: 'GET'
            }
        });
}])    
.factory('calenderEvents', ['$resource', function($resource) {
        return $resource('/api/v1/calender/events/:month', {  param1:'@param1' }, {
            get: {
                method: 'GET'
            }
        });
}])    
.factory('UserReviews', ['$resource', function($resource) {
        return $resource('/api/v1/reviews', {}, {
            get: {
                    method: 'GET'
                }
        });
}])     
.factory('UserAppointment', ['$resource', function($resource) {
        return $resource('/api/v1/appointments', {}, {
            get: {
                    method: 'GET'
                } 
        });
}])      
.factory('ReviewAdd', ['$resource', function($resource) {
        return $resource('/api/v1/reviews/add', {}, {
            add: {
                    method: 'POST'
                } 
        });
}])
.factory('VolunteerMonthlyLogs', ['$resource', function($resource) {
        return $resource('/api/v1/me/volunteer_monthly_logs', {}, {
            get: {
                    method: 'GET'
                } 
        });
}])
.factory('ReferredPatients', ['$resource', function($resource) {
        return $resource('/api/v1/users', {}, {
            get: {
                    method: 'GET'
                } 
        });
}])
.factory('LabTests', ['$resource', function($resource) {
        return $resource('/api/v1/lab_tests', {}, {
            get: {
                    method: 'GET'
                } 
        });
}])
.factory('BookingInstructions', ['$resource', function($resource) {
        return $resource('/api/v1/booking_instructions', {}, {
            get: {
                    method: 'GET'
                } 
        });
}])
.factory('HomePageUsers', ['$resource', function($resource) {
        return $resource('/api/v1/branch_doctors', {}, {
            get: {
                    method: 'GET'
                } 
        });
}])
.factory('HomePageClinics', ['$resource', function($resource) {
        return $resource('/api/v1/users', {}, {
            get: {
                    method: 'GET'
                } 
        });
}])
.factory('myUserFactory', ['$resource', function($resource) {
    return $resource('/api/v1/me', {}, {
        get: {
            method: 'GET'
        }
    });
}])
.factory('ProofTypes', ['$resource', function($resource) {
    return $resource('/api/v1/proof_types', {}, {
        get: {
            method: 'GET'
        }
    });
}])
.factory('SpecialistTypes', ['$resource', function($resource) {
    return $resource('/api/v1/specialist_types', {}, {
        get: {
            method: 'GET'
        }
    });
}])
.factory('attachment', ['$resource', function($resource) {
    return $resource('/api/v1/attachments/', {}, {
        create: {
            method: 'POST'
        }
    });
}])
.factory('AttachmentFactory', ['$resource', function($resource) {
    return $resource('/api/v1/attachments/:attachmentId', {}, {
        remove: {
            method: 'DELETE',
            params: {
                attachmentId: '@attachmentId'
            }
        }
    });
}])
.factory('LabReports', ['$resource', function($resource) {
    return $resource('/api/v1/patient_diagnostic_tests', {}, {
        get: {
            method: 'GET'
        }
    });
}]);