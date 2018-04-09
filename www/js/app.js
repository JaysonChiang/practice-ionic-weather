// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular
  .module("App", ["ionic"])
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state("search", {
        url: "/search",
        controller: "SearchController",
        templateUrl: "views/search/search.html"
      })
      .state("settings", {
        url: "/settings",
        controller: "SettingsController",
        templateUrl: "views/settings/settings.html"
      })
      .state("weather", {
        url: "/weather/:city/:lat/:lng",
        controller: "WeatherController",
        templateUrl: "views/weather/weather.html"
      });

    $urlRouterProvider.otherwise("/weather/台北/23.03/121.57");
  })
  .controller("LeftMenuController", function($scope, Locations) {
    $scope.locations = Locations.data;

    $scope.getIcon = function(current) {
      if (current) {
        return "ion-ios-navigate";
      }
      return "ion-ios-location";
    };
  })

  .factory("Settings", function() {
    var Settings = {
      units: "si",
      days: 8
    };
    return Settings;
  })

  .factory("Locations", function($ionicPopup) {
    function store() {
      localStorage.setItem("locations", angular.toJson(Locations.data));
    }

    var Locations = {
      data: [],

      //確定地點在結果列表的索引
      getIndex: function(item) {
        console.log(item);
        var index = -1;
        Locations.data.forEach(function(location, i) {
          if (item.lat === location.lat && item.lng === location.lng) {
            index = i;
          }
        });
        return index;
      },

      // 從結果列表中增加或是刪除
      toggle: function(item) {
        var index = Locations.getIndex(item);
        if (index >= 0) {
          $ionicPopup
            .confirm({
              title: "Are you sure?",
              template: "This will remove " + Locations.data[index].city
            })
            .then(function(res) {
              if (res) {
                Locations.data.splice(index, 1);
              }
            });
        } else {
          Locations.data.push(item);
          $ionicPopup.alert({
            title: "Location saved"
          });
        }
        store();
      },

      // 如果新增資料，將其移到最頂層或將它增加到最頂層
      primary: function(item) {
        var index = Locations.getIndex(item);
        if (index >= 0) {
          Locations.data.splice(index, 1);
          Locations.data.splice(0, 0, item);
        } else {
          Locations.data.unshift(item);
        }
        store();
      }
    };

    try {
      var items = angular.fromJson(localStorage.getItem("locations")) || [];
      Locations.data = items;
    } catch (e) {
      Locations.data = [];
    }

    return Locations;
  })

  .filter("timezone", function() {
    return function(input, timezone) {
      if (input && timezone) {
        var time = moment.tz(input * 1000, timezone);
        return time.format("LT");
      }
      return "";
    };
  })
  .filter("chance", function() {
    return function(chance) {
      if (chance) {
        var value = Math.round(chance / 10);
        return value * 10;
      }
      return 0;
    };
  })
  .filter("icons", function() {
    var map = {
      "clear-day": "ion-ios-sunny",
      "clear-night": "ion-ios-moon",
      rain: "ion-ios-rainy",
      snow: "ion-ios-snowy",
      sleet: "ion-ios-rainy",
      wind: "ion-ios-flag",
      fog: "ion-ios-cloud",
      cloudy: "ion-ios-cloudy",
      "partly-cloudy-day": "ion-ios-partlysunny",
      "partly-cloudy-night": "ion-ios-cloudy-night"
    };
    return function(icon) {
      return map[icon] || "";
    };
  })
  .filter("toZhTw", function() {
    var map = {
      Monday: "週一",
      Tuesday: "週二",
      Wednesday: "週三",
      Thursday: "週四",
      Friday: "週五",
      Saturday: "週六",
      Sunday: "週日"
    };
    return function(txt) {
      return map[txt] || txt;
    };
  })

  .run(function($ionicPlatform, $http, $state, Locations) {
    $ionicPlatform.ready(function() {
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

      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          function(position) {
            console.log(position.coords.latitude, position.coords.longitude);
            /*
          $http.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: { latlng: position.coords.latitude + ',' + position.coords.longitude }
          })
            .then(function (res) {
              //建立一個新的地點到地點列表
              var location = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                city: res.data.results[0].formatted_address,
                current: true
              };
              Locations.data.unshift(location);
              $state.go('weather', location)
            }
            );
*/
          },
          function(err) {
            console.log("error", err);
          }
        );
      } else {
        console.log("geolocation IS NOT available");
      }
    });
  });
