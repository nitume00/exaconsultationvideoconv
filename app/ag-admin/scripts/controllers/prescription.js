'use strict';
/**
 * @ngdoc function
 * @name eprescriptionApp.controller:BranchesController
 * @description
 * # BranchesController
 * Controller of the eprescriptionApp
 */
angular.module('abs')

.controller('PrescriptionCtrl', function($state, $scope, $http, $location, notification, md5, ConstSecuritySalt,  PrescriptionAction, Upload){

    var params = {};
    $scope.csv_data = {};
    $scope.added_prescriptions = [];
    $scope.sample_csv_file_url = window.location.protocol +'//' + window.location.host + '/images/csv/sample.csv';
    /** 
     * @ngdoc function
     * @name deleteKeywordArray
     * @methodOf ratedSourcesApp.controller:QuoteServiceAddController
     * @kind function
     * @description
     * To delete all keywords at time.
     * @param {int} index current index value
     */
    $scope.getPrescription = function () {
        params = {};
        params.id = $state.params.id;
        params.filter = {};
        params.filter.include = {};
        params.filter.include["0"] = "user.user_profile";
        params.filter.include["1"] = "doctor_user.user_profile.city";
        params.filter.include["2"] = "doctor_user.user_profile.state";
        params.filter.include["3"] = "doctor_user.user_profile.country";
        params.filter.include["4"] = "clinic_user.user_profile.city";
        params.filter.include["5"] = "clinic_user.user_profile.state";
        params.filter.include["6"] = "clinic_user.user_profile.country";
        params.filter.include["7"] = "appointment.user.user_profile";
        params.filter.include["8"] = "prescription_medicine.medicine_type";
        params.filter.include["9"] = "prescription_test";
        params.filter.include["10"] = "prescription_note";
        PrescriptionAction.get(params).$promise.then(function (response) {
            $scope.prescription = response.data;
            console.log(response.data);
            $scope.prescription.pres_url = window.location.protocol +'//' + window.location.host + '/prescription/pdf/'+ $scope.prescription.id + '/' + md5.createHash($scope.prescription.id+'pdf'+ConstSecuritySalt.SECURITY_SALT);
            if (angular.isDefined(response.error.code === 0)) {
                angular.forEach($scope.prescription.prescription_medicine, function (medicine) {
                    $scope.added_prescriptions.push({
                        "prescription_id": medicine.prescription_id,
                        "name": medicine.name,
                        "medicine_type": medicine.medicine_type.name,
                        'dosage_unit': medicine.dosage_unit,
                        'dosage':  medicine.dosage,
                        'usage_days': medicine.usage_days,
                    });
                });
            }   
        });
    };

    $scope.changeStatus = function (prescription_id,status) {
        var data = {};
        data.id = prescription_id;
        if(status === 'is_delivered') {
            data.is_delivered = 1;
        } else if(status === 'is_active'){
            data.is_active = 1;
        }    
        PrescriptionAction.put(data, function (response) {
            if (response.error.code === 0) {
                notification.log('Your changes successfully saved', {
                    addnCls: 'humane-flatty-success'
                });
                $location.path('/prescriptions/list');
            } else {
                notification.log("Your changes couldn't successfully saved. Please try again.", {
                    addnCls: 'humane-flatty-error'
                });
            }
        });
    }

    $scope.index = function () {
        $scope.getPrescription();
    };   
    /* [ SHOWHIDE - IMPORT CSV ] */
    $scope.enableDeliveryFrm = function () {
        //If DIV is visible it will be hidden and vice versa.
        $scope.isEnabledForm = $scope.isEnabledForm ? false : true;
    };

    /**
     * @ngdoc method
     * @name PrescriptionCtrl.SubmitImportCSV
     * @methodOf module.PrescriptionCtrl
     * @description
     * This method is used to store the medicines records
     */
    $scope.SubmitImportCSV = function() {
        $http.post('/api/v1/medicines/import', $scope.csv_data)
            .success(function(response) {
                if (response.error.code === 0) {
                    console.log(response);
                    console.log('success');
                    notification.log('Import medicines added successfully', {
                        addnCls: 'humane-flatty-success'
                    });
                    $location.path('/medicines/list');
                } else {
                    notification.log(response.error.message, {
                        addnCls: 'humane-flatty-error'
                    });
                }
            });
    }
    /**
     * @ngdoc method
     * @name PrescriptionCtrl.ImportCSV
     * @methodOf module.PrescriptionCtrl
     * @description
     * This method is used to upload CSV file
     */
     $scope.ImportCSV = function(file) {
        console.log(file);
       Upload.upload({
                url: '/api/v1/attachments?class=CSV',
                data: {
                    file: file,
                }
            })
            .success(function(response) {
                if (response.error.code === 0) {
                    $scope.csv_data.csv = response.attachment;  
                }  
            })
            .catch(function(error) {
                notification.log(error.error.message, {
                    addnCls: 'humane-flatty-error'
                });
            });
    }

    $scope.dispatch = function($valid, formname) {
        $scope.presData = {};
        $scope.presData.medicines = [];
        $scope.presData.prescription_id = $state.params.id;
        if ($scope.added_prescriptions.length > 0) {
            angular.forEach($scope.added_prescriptions, function (medicineLog) {
                var obj_logs = {
                    "medicine_name": medicineLog.name,
                    "prescription_id": medicineLog.prescription_id,
                    "quantity": medicineLog.quantity, 
                    "amount": medicineLog.amount,
                };
                $scope.presData.medicines.push(obj_logs);
            });
        }
        $http.post('/api/v1/medicine_delivery_logs', $scope.presData)
            .success(function(response) {
                if (response.error.code === 0) {
                    notification.log(response.message, {
                        addnCls: 'humane-flatty-success'
                    });
                    $location.path('/prescriptions/list');
                } else {
                    notification.log(response.error.message, {
                        addnCls: 'humane-flatty-error'
                    });
                }
            });
    }

    $scope.index();
});    