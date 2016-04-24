(function () {
  'use strict';

  angular.module('baltimoreMurals.controllers')
    .controller('artistsController', ['$scope', function($scope){
      $scope.title = "Murals by Artist";
      $scope.hint = "Hover over a bubble to see\n the name of the artist"
    }]);

}());
