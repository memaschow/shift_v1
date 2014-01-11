// The contents of individual model .js files will be concatenated into dist/models.js

(function() {

// Protects views where angular is not loaded from errors
if ( typeof angular == 'undefined' ) {
	return;
};


var module = angular.module('ShiftModel', ['restangular']);

module.factory('ShiftRestangular', function(Restangular) {

  return Restangular.withConfig(function(RestangularConfigurer) {

// -- Stackmob REST API configuration

    RestangularConfigurer.setBaseUrl('http://api.stackmob.com');
    RestangularConfigurer.setRestangularFields({
      id: "shift_id"
    });

    RestangularConfigurer.setDefaultHeaders({
      'Accept': 'application/vnd.stackmob+json; version=0',
      'X-StackMob-API-Key-6aaba3a3-eb22-4586-bc57-f05822ea8a35': '1'
    });

  });

});


})();
