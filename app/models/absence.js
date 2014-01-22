// The contents of individual model .js files will be concatenated into dist/models.js

(function() {

// Protects views where angular is not loaded from errors
if ( typeof angular == 'undefined' ) {
	return;
};


var module = angular.module('AbsenceModel', ['restangular']);

module.factory('AbsenceRestangular', function(Restangular) {

  window.setTimeout(function() {
    alert("Good! Now configure app/models/absence.js");
  }, 2000);

  return Restangular.withConfig(function(RestangularConfigurer) {

// -- Stackmob REST API configuration

// -- Stackmob REST API configuration

    RestangularConfigurer.setBaseUrl('http://api.stackmob.com');
    RestangularConfigurer.setRestangularFields({
      id: "absence_id"
    });

    RestangularConfigurer.setDefaultHeaders({
      'Accept': 'application/vnd.stackmob+json; version=0',
      'X-StackMob-API-Key-6aaba3a3-eb22-4586-bc57-f05822ea8a35': '1'
    });

  });

});


})();
