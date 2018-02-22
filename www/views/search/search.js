angular.module('App')
    .controller('SearchController', function ($scope, $http) {
        $scope.model = { term: '' };
        $scope.search = function () {
            $http.get('https://maps.googleapis.com/maps/api/geocode/json', { params: { address: $scope.model.term } })
                .then(function (res) {
                    $scope.results = res.data.results;
                }, function (err) {
                    console.log(err);
                })
        }
    })