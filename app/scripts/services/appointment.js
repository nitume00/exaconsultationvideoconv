'use strict';
/**
 * @ngdoc service
 * @name adlawApp.appointment
 * @description
 * # appointment
 * Factory in the adlawApp.
 */
angular.module('abs')
.factory('AppointmentFactory', ['$resource', function($resource) {
        return $resource('/api/v1/appointments', {}, {
            get: {
                method: 'GET'
            }
        });
}])
.factory('appointmentView', ['$resource', function($resource) {
        return $resource('/api/v1/appointment/:id', {id: '@id'}, {
            get: {
                method: 'GET'
            }
        });
}])
.factory('appointmentSetting', ['$resource', function($resource) {
        return $resource('/api/v1/appointment_settings?zone='+localStorage.zone, {}, {
            update: {
                method: 'POST'
            },
            get: {
                method: 'GET'
            }
        });
}])
.factory('AppointmentSettingService', ['$resource', function($resource) {
    return $resource('/api/v1/appointment_settings', {}, {
        get: {
            method: 'GET'
        }
    });
}])
.factory('AppoinmentSettings', ['$resource', function($resource) {
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
.factory('appointmentModification', ['$resource', function($resource) {
        return $resource('/api/v1/appointment_modifications', {}, {
            get: {
                method: 'GET'
            }
        });
}]) 
.factory('appointmentModificationDelete', ['$resource', function($resource) {
        return $resource('/api/v1/appointment_modifications/:id', {id:'@id'}, {
            delete: {
                method: 'delete'
            }
        });
}])    
.factory('AppoinmentModifications', ['$resource', function($resource) {
    return $resource('/api/v1/appointment_modifications', {}, {
        'get': {
            method: 'GET'
        },
        'post': {
            method: 'POST'
        }
    });
}])
.factory('appointmentModificationAdd', ['$resource', function($resource) {
        return $resource('/api/v1/appointment_modifications', {}, {
            add: {
                method: 'POST'
            }
        });
}])      
.factory('appointmentModificationEdit', ['$resource', function($resource) {
        return $resource('/api/v1/appointment_modifications/:id', {id: '@id'}, {
            get: {
                method: 'GET'
            },
            update:{
                method: 'PUT'
            }
        });
}])   
.factory('BookingAppointmentDetails', ['$resource', function($resource) {
        return $resource('/api/v1/branch_doctors', {}, {
            get: {
                method: 'GET'
            } 
         });
}]) 
.factory('AppointmentTypes', ['$resource', function($resource) {
    return $resource('/api/v1/appointment_types', {}, {
        get: {
            method: 'GET'
        } 
     });
}])    
.factory('Gender', ['$resource', function($resource) {
        return $resource('/api/v1/genders', {}, {
            genderList: {
                method: 'GET'
            }
        });
}])     
.factory('AppointmentBookingAdd', ['$resource', function($resource) {
        return $resource('/api/v1/appointments', {}, {
            post: {
                method: 'POST'
            }
        });
}])      
.factory('ChangeStatus', ['$resource', function($resource) {
        return $resource('/api/v1/appointments/:id/change_status', {id:'@id'}, {
            put: {
                    method: 'PUT'
                }
        });
}])      
.factory('splitedTimeSlot', ['$resource', function($resource) {
        return $resource('/api/v1/appointment_settings/:apt_settings_id/timeslot', {apt_settings_id:'@apt_settings_id'}, {
            get:{
                    method: 'GET'
                }
        });
}])
.factory('RescheduleAppointment', ['$resource', function($resource) {
        return $resource('/api/v1/appointments/:id', {id:'@id'}, {
            put:{
                    method: 'PUT'
                }
        });
}])            
.factory('MyDocotors', ['$resource', function($resource) {
        return $resource('/api/v1/user/favorite', {}, {
            get:{
                    method: 'GET'
                }
        });
}]);  