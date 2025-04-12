
var app = angular.module('myApp', [])
    .controller('myCtrl', function ($scope, $http) {
        $scope.Main = {

            GetStorage: function (key) {

                var tmpJsonData = localStorage.getItem("json");
                return JSON.parse(tmpJsonData);
            },
            SaveStorage: function (data) {
                localStorage.setItem("json", data);
                alert('اطلاعات با موفقیت ذخیره شد');
            },
        }

        $scope.currentStep = 0;

        var tmpData = $scope.Main.GetStorage();
        debugger
        if (tmpData != undefined)
            $scope.formData = tmpData;
        else {
            // Fetch JSON data from file
            $http.get('formData.json')
                .then(function (response) {
                    $scope.formData = response.data;
                })
                .catch(function (error) {
                    console.error('Error fetching formData:', error);
                });
        }

        $scope.setCurrentStep = function (index) {
            $scope.currentStep = index;
        };


        $scope.Degree = [
            { Id: 0, Title: "متوسطه " },
            { Id: 0, Title: "دیپلم" },
            { Id: 2, Title: "کاردانی" },
            { Id: 3, Title: "کارشناسی" },
            { Id: 3, Title: "کارشناسی ارشد" },
            { Id: 4, Title: "دکترا" },
        ]

        $scope.activeTabIndex = 0;

        $scope.nextTab = function () {
            $scope.activeTabIndex = Math.min($scope.activeTabIndex + 1, $scope.formData.tabs.length - 1);
        };

        $scope.prevTab = function () {
            $scope.activeTabIndex = Math.max($scope.activeTabIndex - 1, 0);
        };

        $scope.setActiveTab = function (index) {
            $scope.activeTabIndex = index;
        };

        $scope.generateJson = function () {
            var formData = angular.copy($scope.formData);

            // Remove any temporary properties before generating JSON
            angular.forEach(formData.tabs, function (tab) {
                angular.forEach(tab.fields, function (field) {
                    if (field.type === 'grid') {
                        delete field.newRow;
                    }
                });
            });

            var jsonOutput = JSON.stringify(formData, null, 2);
            $scope.Main.SaveStorage(jsonOutput);

            // alert(jsonOutput);
        };

        $scope.addRow = function (field) {

            field.NewRow.editing = true;
            field.items.push(angular.copy(field.NewRow));

        };
        ;
        $scope.editCell = function (row) {
            row.editing = true;
        };
        $scope.updateCell = function (row, header) {
            row.editing = false;

        };
        $scope.deleteRow = function (field, index) {
            field.items.splice(index, 1); // Remove row at index
        };
        $scope.saveRow = function (item) {
            item.editMode = false;
        };

        $scope.removeRow = function (field, index) {
            field.items.splice(index, 1);
        };
        $('.smooth-goto').on('click', function () {
            $('html, body').animate({ scrollTop: $(this.hash).offset().top - 50 }, 2000);
            return false;
        });

     

    });



app.directive('childComponent', function () {
    return {
        restrict: 'E',
        scope: {
            displayFirst: '=',
            title: '@'
        },
        templateUrl: 'Img.html',
        link: function (scope, element, attrs) {
            scope.onFileSelected = function (event) {
                const file = event.target.files[0];
                const reader = new FileReader();
                reader.onload = function (event) {
                    const base64Image = event.target.result;
                    scope.displayFirst = base64Image;
                    scope.$apply();
                };
                reader.readAsDataURL(file);
            };
        }
    };
});




function GetScope() {//GetScope().Account_Info
    return angular.element(document.getElementById('myCtrlID')).scope();
}
