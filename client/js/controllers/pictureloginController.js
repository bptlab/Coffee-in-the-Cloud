define(["jquery"], function (jQuery) {
    "use strict";

    function pictureloginController($scope, $rootScope, alert, service) {

      $rootScope.tablet = true;
        $scope.schedule = null;

        service.schedule.get().success(function (data) {
            $scope.schedule = data;

            var date=new Date();
            var dd=date.getDate();
            var mm=date.getMonth() + 1;
            var yyyy=date.getFullYear();
            if(mm<10){
                mm="0"+mm;
            };
            if(dd<10){
                dd="0"+dd;
            }
            var today = yyyy+"-"+mm+"-"+dd;
            $.each(data, function (idx, obj) {

                if (today==obj.date && !obj.done){
                    $scope.cleaning=true;
                    $scope.cleaning_message=obj.user.first_name + " " + obj.user.last_name +" has to do the"+ (obj.type == "w" ? " weekly " : (obj.type == "b" ? " biweekly " : " other "))+"cleaning today";
                }
            });
        });


      $scope.tablet_user = null;

      service.user.list().success(function (data) {
        $scope.users = data;
      });

      $scope.select = function(user_id) {
        $scope.tablet_user = user_id;
      }

      $scope.addCoffee = function (user_id, amount) {
        service.tally.addForUser(user_id, amount || 1).success(function (result) {
          $rootScope.updateTally();
          alert.success(amount + (amount == 1 ? " coffee" : " coffees") + " added.");
        }).error(function (result) {
          alert.error("Error adding entry. Please try again later!");
        });
      };

        $rootScope.finishedCleaning = function() {
            service.schedule.done().success(function (data) {
                alert.success("Thank you for doing the cleaning!");
                $scope.cleaning= false;
            }).error(function (result) {
                alert.error("Cleaning couldn't be marked as done!");
            })
        };

        $scope.blame = function() {
            alert.success("Thanks for your feedback!");
            service.blame();
        }

        $scope.mailEmptyCoffee = function() {
            alert.success("Thanks for your Notification!");
            service.mailEmptyCoffee();
        }
    }

    pictureloginController.$inject = ["$scope", "$rootScope", "seed.status", "seed.coffeeCloud"];

    return pictureloginController;
});
