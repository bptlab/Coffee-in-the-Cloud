define(["jquery"], function (jQuery) {
    "use strict";

    function settingsController($scope, $rootScope, alert, service) {
        $scope.reset = function () {
            $scope.changePassword = false;
            service.settings.get().success(function (result) {
                $scope.settings = result;
            }).error(function (result) {
                alert.error("Error fetching data.");
            });

            service.user.list().success(function (list) {
                $scope.users = list;
            });

            service.balance.get().success(function (result) {
                $scope.balance = result.balance;
            })
        };

        $scope.update = function () {
            if ($scope.settings && $scope.settings.pw_old && $scope.settings.pw_new && $scope.settings.pw_new2) {
                if ($scope.settings.pw_new != $scope.settings.pw_new2) {
                    alert.error("The passwords do not match!");

                    return;
                }
                $scope.settings.pw_new2 = null;
            }
            else {
                $scope.settings.pw_old = null;
                $scope.settings.pw_new = null;
                $scope.settings.pw_new2 = null;
            }

            service.settings.post($scope.settings).success(function (result) {
                $scope.reset();
                $rootScope.$broadcast('updateUser', []);
                alert.success("Settings updated.");
            }).error(function (result) {
                alert.error("Error pushing data.");
            })
        };


        $scope.update_balance = function () {
            if ($scope.balance_amount) {
                var userId;
                var userName;
                if ($scope.balance_user === undefined) {
                    userId = $rootScope.user.id;
                    userName = $rootScope.user.first_name + " " + $rootScope.user.last_name;
                } else {
                    userId = $scope.balance_user;
                    angular.forEach($scope.users, function (value, key) {
                        if (value.id == userId) {
                            userName = value.first_name + " " + value.last_name;
                        }
                    });
                }
                service.balance.post($scope.balance_amount, userId).success(function (result) {
                    alert.success("You added an amount of " + $scope.balance_amount + "€ to " + userName + ".");
                    $scope.reset();
                    $rootScope.$broadcast('updateUser', []);
                }).error(function (result) {
                    alert.error("There was an error processing the data.");
                });
            }
        }
        $scope.reset();
    }


    settingsController.$inject = ["$scope", "$rootScope", "seed.status", "seed.coffeeCloud"];

    return settingsController;
});
