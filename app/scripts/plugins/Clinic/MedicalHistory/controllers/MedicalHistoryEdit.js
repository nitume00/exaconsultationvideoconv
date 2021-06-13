(function (module) {
    module.controller('MedicalHistoryEditController', function ($state, $filter, $scope, $rootScope, Flash, MedicalHistoryEditFactory, SpecialtiesFactory, AttDeleteFactory) {
        var model = this;
         $scope.year = {
            start: '1975',
            end: new Date().getFullYear()
        };
        model.init = function () {
            $rootScope.pageTitle = $rootScope.settings['site.name'] + " | " + $filter("translate")("Edit Medical History");
        };

         SpecialtiesFactory.get().$promise.then(function (response) {
            $scope.specialities = response.specialties;
        });

        MedicalHistoryEditFactory.get({id: $state.params.id}).$promise.then(function (response) {
            model.medical_history = response.data[0];
            model.medical_history.attachments_show = false;
            if (angular.isDefined(model.medical_history.attachments.data[0])) {
                model.medical_history.attachments = model.medical_history.attachments.data;
                model.medical_history.attachments_show = true;
            }
        });

        model.MedicalHistoryEdit = function ($valid) {
            if($valid){
                MedicalHistoryEditFactory.update({id: $state.params.id}, model.medical_history).$promise.then(function (response) {
                    Flash.set($filter("translate")(response.Success), 'success', true);
                    $state.go('MedicalHistory');
                });
            }
       };
       $scope.AttDelete = function (id) {
           AttDeleteFactory.delete({ id: id }).$promise.then(function (response) {
                if (response.Success) {
                    Flash.set($filter("translate")(response.Success), 'success', true);
                } else {
                    Flash.set($filter("translate")(response.Failed), 'error', false);
                }
                MedicalHistoryEditFactory.get({id: $state.params.id}).$promise.then(function (response) {
                    model.medical_history = response.data[0];
                    model.medical_history.attachments = model.medical_history.attachments.data;
                });
            }); 
        };
        model.init();
    });

// The name of the module, followed by its dependencies (at the bottom to facilitate enclosure)
}(angular.module("abs.Clinic.MedicalHistory")));