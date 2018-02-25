angular.module('App')
    .controller('SearchController', function ($scope, $http, $ionicLoading) {
        $scope.model = { term: '' };
        $scope.search = function () {
            $ionicLoading.show();
            $http.get('https://maps.googleapis.com/maps/api/geocode/json', { params: { address: $scope.model.term } })
                .then(function (res) {
                    $scope.results = res.data.results;
                    $ionicLoading.hide();
                }, function (err) {
                    $ionicLoading.show({
                        template: err,
                        duration: 3000
                    });
                })
        }
    })