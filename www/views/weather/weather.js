angular
  .module("App")
  .controller("WeatherController", function(
    $scope,
    $http,
    $stateParams,
    $ionicActionSheet,
    $ionicModal,
    $ionicLoading,
    Settings,
    Locations
  ) {
    $scope.params = $stateParams;
    $scope.settings = Settings;

    $ionicLoading.show();
    $scope.isLoading = true;
    $http
      .get("/api/forecast/" + $stateParams.lat + "," + $stateParams.lng, {
        params: { units: Settings.units, lang:'zh-tw' }
      })
      .then(
        function(res) {
          $scope.forecast = res.data;
          console.log(res.data);
          $ionicLoading.hide();
          $scope.isLoading = false;
        },
        function(err) {
          $ionicLoading.show({
            template: err.data,
            duration: 3000
          });
          $scope.isLoading = true;
        }
      );

    // $ionicSlides START
    $scope.options = {
      loop: false,
      effect: "slide",
      speed: 500
    };

    $scope.$on("$ionicSlides.sliderInitialized", function(event, data) {
      // data.slider is the instance of Swiper
      $scope.slider = data.slider;
    });

    $scope.$on("$ionicSlides.slideChangeStart", function(event, data) {
      console.log("Slide change is beginning");
    });

    $scope.$on("$ionicSlides.slideChangeEnd", function(event, data) {
      // note: the indexes are 0-based
      $scope.activeIndex = data.slider.activeIndex;
      $scope.previousIndex = data.slider.previousIndex;
    });
    // $ionicSlides END

    //Scroll
    var barHeight = document.getElementsByTagName("ion-header-bar")[0]
      .clientHeight;

    $scope.getWidth = function() {
      return window.innerWidth + "px";
    };

    $scope.getHeight = function() {
      return parseInt(window.innerHeight - barHeight) + "px";
    };

    $scope.getTotalHeight = function() {
      return parseInt(parseInt($scope.getHeight()) * 3) + "px";
    };

    $scope.showOptions = function() {
      var sheet = $ionicActionSheet.show({
        buttons: [
          { text: "Toggle Favorite" },
          { text: "Set as Primary" },
          { text: "Sunrise Sunset Chart" }
        ],
        cancelText: "Cancel",
        buttonClicked: function(index) {
          var item = {
            city: $scope.params.city,
            lat: +$scope.params.lat,
            lng: +$scope.params.lng
          };
          if (index === 0) {
            Locations.toggle(item);
          }
          if (index === 1) {
            Locations.primary(item);
          }
          if (index === 2) {
            $scope.showModal();
          }
          return true;
        }
      });
    };

    $scope.showModal = function() {
      if ($scope.modal) {
        $scope.modal.show();
      } else {
        $ionicModal
          .fromTemplateUrl("views/weather/modal-chart.html", {
            scope: $scope
          })
          .then(function(modal) {
            $scope.modal = modal;

            var days = [];
            var day = Date.now();
            for (var i = 0; i < 365; i++) {
              day += 1000 * 60 * 60 * 24;
              days.push(
                SunCalc.getTimes(day, $scope.params.lat, $scope.params.lng)
              );
            }
            $scope.chart = days;

            $scope.modal.show();
          });
      }
    };

    $scope.hideModal = function() {
      $scope.modal.hide();
    };

    $scope.$on("$destroy", function() {
      $scope.modal.remove();
    });
  });
