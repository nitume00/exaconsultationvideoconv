(function (module) {
    module.controller('MedicalHistoryAddController', function ($state, $scope, Flash, $filter, MedicalHistoryAddFactory, SpecialtiesFactory) {
        var model = this;
        $scope.year = {
            start: '1975',
            end: new Date().getFullYear()
        };
        
        SpecialtiesFactory.get().$promise.then(function (response) {
            $scope.specialities = response.specialties;
        });

        $scope.MedicalHistory = function () {
            MedicalHistoryAddFactory.save(model.medical_history)
                    .$promise
                    .then(function (response) {
                        Flash.set($filter("translate")(response.Success), 'success', true);
                        $state.go('MedicalHistory', {});
                    });
        };
    });
}(angular.module("abs.Clinic.MedicalHistory")));