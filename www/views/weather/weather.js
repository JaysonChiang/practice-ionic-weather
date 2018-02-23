angular.module('App')
    .controller('WeatherController', function ($scope, $http, $stateParams, Settings) {
        $scope.params = $stateParams;
        $scope.settings = Settings;

        $http.get('/api/forecast/' + $stateParams.lat + ',' + $stateParams.lng, { params: { units: Settings.units } })
            .then(function (res) {
                $scope.forecast = res.data;
            }, function (err) {
                console.log(err);
            })

        //Scroll
        var barHeight = document.getElementsByTagName('ion-header-bar')[0].clientHeight;

        $scope.getWidth = function () {
            return window.innerWidth + 'px';
        }

        $scope.getHeight = function () {
            return parseInt(window.innerHeight - barHeight) + 'px';
        }

        $scope.getTotalHeight = function () {
            return parseInt(parseInt($scope.getHeight()) * 3) + 'px';
        }


    })