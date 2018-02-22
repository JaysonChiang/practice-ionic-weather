// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('App', ['ionic'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('search', {
        url: '/search',
        controller: 'SearchController',
        templateUrl: 'views/search/search.html'
      })
      .state('settings', {
        url: '/settings',
        controller: 'SettingsController',
        templateUrl: 'views/settings/settings.html'
      })
      .state('weather', {
        url: '/weather/:city/:lat/:lng',
        controller: 'WeatherController',
        templateUrl: 'views/weather/weather.html'
      })

    $urlRouterProvider.otherwise('/search');
  })
  .controller('LeftMenuController',function($scope,Locations){
    $scope.locations = Locations.data;
  })

  .factory('Settings', function () {
    var Settings = {
      units: 'us',
      days: 8
    };
    return Settings;
  })

  .factory('Locations', function () {
    var Locations = {
      data: [{
        city: 'Chicago, IL, USA',
        lat: 41.8781136,
        lng: -87.6297928
      }],

      //確定地點在結果列表的索引
      getIndex: function (item) {
        var index = -1;
        Locations.data.forEach(function (location, i) {
          if (item.lat === location.lat && item.lng === location.lng) {
            index = i;
          }
        });
        return index;
      },

      // 從結果列表中增加或是刪除
      toggle: function (item) {
        var index = Locations.getIndex(item);
        if (index >= 0) {
          Locations.data.splice(index, 1);
        } else {
          Locations.data.push(item);
        }
      },

      // 如果新增資料，將其移到最頂層或將它增加到最頂層
      primary: function (item) { 
        var index = Locations.getIndex(item);
        if (index >= 0) {
          Locations.data.splice(index, 1);
          Locations.data.splice(0, 0, item);
        } else {
          Locations.data.unshift(item);
        }
      }
    }
    return Locations;
  })
  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  })
