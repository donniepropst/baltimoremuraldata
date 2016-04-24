(function () {
  'use strict';

  // create the angular app
  angular.module('baltimoreMurals', [
    'baltimoreMurals.controllers',
    'baltimoreMurals.directives'
    ]);
  
  // setup dependency injection
  angular.module('d3', []);
  angular.module('baltimoreMurals.controllers', []);
  angular.module('baltimoreMurals.directives', ['d3']);


}());