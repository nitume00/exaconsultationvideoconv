'use strict';
/**
 * @ngdoc function
 * @name abs.controller:BranchesController
 * @description
 * # BranchesController
 * Controller of the abs
 */
angular.module('abs')

.controller('PrescriptionController', function($state, $rootScope, $scope, $filter, $timeout, flash, $location, Prescriptions, AppointmentAction, PrescriptionAction, MedicineTypes, MyAppointments, ConstGenderType){

    $rootScope.pageTitle = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("Prescriptions");
    $scope.ConstGenderType = ConstGenderType;
    $timeout(function () {
        $scope.text_box = true;
    }, 1000);
    var params = {};
    
    /** 
     * @ngdoc function
     * @name deleteKeywordArray
     * @methodOf abs.controller:QuoteServiceAddController
     * @kind function
     * @description
     * To delete all keywords at time.
     * @param {int} index current index value
     */
    $scope.deleteMedicineArray = function (index) {
        $scope.added_medicines.splice(index, 1);
    };

    /**
     * @ngdoc function
     * @name AddMedicines
     * @methodOf abs.controller:PrescriptionController
     * @kind function
     * @description
     * Function to add new keywords information like medicine name, unit, dose and days
     */
    $scope.AddMedicines = function () {
        $scope.added_medicines.push({
            'medicine_type_id': 1,
            'name': '',
            'dosage_unit': '',
            'dosage': '',
            'usage_days': '',
            'description': '',
            'is_before_food': '',
            'is_after_food': '',
            'is_morning': '',
            'is_noon': '',
            'is_night': ''
        });
    };
    /** 
     * @ngdoc function
     * @name deleteKeywordArray
     * @methodOf abs.controller:QuoteServiceAddController
     * @kind function
     * @description
     * To delete all keywords at time.
     * @param {int} index current index value
     */
    $scope.deleteTestArray = function (index) {
        $scope.added_tests.splice(index, 1);
    };
    /**
     * @ngdoc function
     * @name AddMedicines
     * @methodOf abs.controller:PrescriptionController
     * @kind function
     * @description
     * Function to add new keywords information like medicine name, unit, dose and days
     */
    $scope.AddTests = function () {
        $scope.added_tests.push({
            'name': '',
            'description': ''
        });
    };
    
    /** 
     * @ngdoc function
     * @name deleteKeywordArray
     * @methodOf abs.controller:QuoteServiceAddController
     * @kind function
     * @description
     * To delete all keywords at time.
     * @param {int} index current index value
     */
    $scope.deleteAdviceArray = function (index) {
        $scope.added_advices.splice(index, 1);
    };
    /**
     * @ngdoc function
     * @name AddMedicines
     * @methodOf abs.controller:PrescriptionController
     * @kind function
     * @description
     * Function to add new keywords information like medicine name, unit, dose and days
     */
    $scope.AddAdvices = function () {
        $scope.added_advices.push({
            'description': ''
        });
    };
    /**
     * @ngdoc function
     * @name index
     * @methodOf abs.controller:PrescriptionController
     * @kind function
     * @description
     * Function to load all neccessary data like medicine details.
     */
    $scope.index = function () {
        $scope.data = {};
        $scope.added_medicines = [];
        $scope.added_tests = [];
        $scope.added_advices = [];
        $scope.todayDateTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm');
        $scope.AddMedicines();
        $scope.AddTests();
        $scope.AddAdvices();
        $scope.getAppointmentDeail();
        if($state.current.name === 'prescription_view') {
            $scope.getPrescription();    
        }
        if($state.current.name === 'PrescriptionAdd') {
            $scope.getMedicineTypes();    
        }
        if($state.current.name === 'me_prescriptions') {
            $scope.meAppointments();
        }    
        console.log($state.current.name);
    };

    /**getAppointmentDeail
     * @ngdoc function
     * @name index
     * @methodOf abs.controller:PrescriptionController
     * @kind function
     * @description
     * Function to load all neccessary data like medicine details.
     */
    $scope.prescriptionAdd = function ($valid, formname) {
        if (!formname.$valid) { 
            angular.element("[name='" + formname.$name + "']").find('.ng-invalid:visible:first').focus(); 
            return false; 
        }
        if($valid) {
            $scope.presData = {};
            $scope.presData.medicines = [];
            $scope.presData.tests = [];
            $scope.presData.advices = [];
            $scope.presData.user_id = $scope.appointment.user_id;
            $scope.presData.doctor_user_id = $scope.appointment.provider_user_id;
            $scope.presData.clinic_user_id = $scope.appointment.clinic_user_id;
            $scope.presData.appointment_id = $state.params.id;
            $scope.presData.patient_condition = $scope.data.patient_condition;
            $scope.presData.weight = $scope.data.weight;
            $scope.presData.blood_pressure = $scope.data.blood_pressure;
            $scope.presData.pulse = $scope.data.pulse;
            $scope.presData.temperature = $scope.data.temperature;
            $scope.presData.rx_number = $scope.data.rx_number;
            if ($scope.added_medicines.length > 0) {
                angular.forEach($scope.added_medicines, function (medicine) {
                    $scope.presData.medicines.push({
                        "name": medicine.name,
                        "medicine_type_id": medicine.medicine_type_id,
                        'dosage_unit': medicine.dosage_unit,
                        'dosage':  medicine.dosage,
                        'usage_days': medicine.usage_days,
                        'description': medicine.description,
                        'is_before_food': (medicine.presDay === 'before_food') ? 1 : 0,
                        'is_after_food': (medicine.presDay === 'after_food') ? 1 : 0,
                        'is_morning': (medicine.is_morning) ? 1 : 0,
                        'is_noon': (medicine.is_noon) ? 1 : 0,
                        'is_night': (medicine.is_night) ? 1 : 0,
                    });
                });
            }    
            if ($scope.added_tests.length > 0) {
                angular.forEach($scope.added_tests, function (test) {
                    $scope.presData.tests.push({
                        "name": test.name,
                        'description': test.description
                    });
                });
            }    
            if ($scope.added_advices.length > 0) {
                angular.forEach($scope.added_advices, function (advice) {
                    $scope.presData.advices.push({
                        'description': advice.description
                    });
                });
            } 
            console.log($scope.data,'presDay');
            console.log($scope.presData);
            Prescriptions.create($scope.presData, function(response) {
                if (response.error.code === 0) {
                    flash.set($filter("translate")("Prescription added successfully."), 'success', false);
                    $location.path('/appointments/approved');
                } else {
                    flash.set($filter("translate")(response.error.message), 'error', false);
                }    
            });
        }
    };  

    /** 
     * @ngdoc function
     * @name deleteKeywordArray
     * @methodOf abs.controller:QuoteServiceAddController
     * @kind function
     * @description
     * To delete all keywords at time.
     * @param {int} index current index value
     */
    $scope.getAppointmentDeail = function () {
        params = {};
        params.id = $state.params.id;
        params.filter = {};
        params.filter.include = {};
        params.filter.include["0"] = "user.user_profile";
        params.filter.include["1"] = "provider_user";
        params.filter.include["2"] = "clinic_user";
        AppointmentAction.get(params).$promise.then(function (response) {
            $scope.appointment = response.data;
        });
    };

    /** 
     * @ngdoc function
     * @name deleteKeywordArray
     * @methodOf abs.controller:QuoteServiceAddController
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
            console.log($scope.prescription);
        });
    };

    /** 
     * @ngdoc function
     * @name deleteKeywordArray
     * @methodOf abs.controller:QuoteServiceAddController
     * @kind function
     * @description
     * To delete all keywords at time.
     * @param {int} index current index value
     */
    $scope.getMedicineTypes = function () {
        params = {};
        MedicineTypes.get(params).$promise.then(function (response) {
            $scope.medicine_types = response.data;
        });
    };

    /** 
     * @ngdoc function
     * @name deleteKeywordArray
     * @methodOf abs.controller:QuoteServiceAddController
     * @kind function
     * @description
     * To delete all keywords at time.
     * @param {int} index current index value
     */
    $scope.meAppointments = function () {
        params = {};
        $scope.loader = true;
        var Where = [];
        var api_filter = {};
        Where.push({
            "where": {},
            "include": {}
        });
        api_filter.user_id =  $rootScope.auth.id;
        Where[0].include[0] = 'user.user_profile';
        Where[0].include[1] = 'provider_user.user_profile';
        Where[0].include[2] = 'clinic_user.user_profile';
        Where[0].include[3] = 'appointment_status';
        Where[0].include[4] = 'prescription';
        Where[0].where = api_filter;
        Where[0].skip = $scope.skipvalue;
        Where[0].limit = $scope.itemsPerPage;
        Where[0].order = 'id desc';
        params.filter = JSON.stringify(Where[0]);
        MyAppointments.get(params).$promise.then(function (response) {
            $scope.appointments = response.data;
            $scope.isShown = (response.data.length > 0) ? true : false;
        });
    };

    /** 
     * @ngdoc function
     * @name deleteKeywordArray
     * @methodOf abs.controller:QuoteServiceAddController
     * @kind function
     * @description
     * To delete all keywords at time.
     * @param {int} index current index value
     */
    $scope.printView = function () {
        window.print();
    };
    
    $scope.printToPrescription = function(printSectionId) {
        var innerContents = document.getElementById(printSectionId).innerHTML;
        var popupWinindow = window.open('', '_blank', 'width=700,height=800,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
        popupWinindow.document.open();
        popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="'+ window.location.protocol +'//' + window.location.host +'/app/styles/bootstrap.css" /></head><body onload="window.print()">' + innerContents + '</html>');
        popupWinindow.document.close();
      }
    $scope.index();
});