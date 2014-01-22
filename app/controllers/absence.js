var absenceApp = angular.module('absenceApp', ['AbsenceModel', 'hmTouchevents']);
//Absences are visibe in calender(TODO). They have Start_date and End_date and time

// Index: http://localhost/views/absence/index.html

absenceApp.controller('IndexCtrl', function ($scope, AbsenceRestangular) {

  // This will be populated with Restangular
  $scope.absences = [];

  // Helper function for opening new webviews
  $scope.open = function(id) {
    webView = new steroids.views.WebView("/views/absence/show.html?id="+id);
    steroids.layers.push(webView);
  };

  // Helper function for loading absence data with spinner
  $scope.loadAbsences = function() {
    $scope.loading = true;

    absences.getList().then(function(data) {
      $scope.absences = data;
      $scope.loading = false;
    });

  };

  // Fetch all objects from the backend (see app/models/absence.js)
  var absences = AbsenceRestangular.all('absence');
  $scope.loadAbsences();


  // Get notified when an another webview modifies the data and reload
  window.addEventListener("message", function(event) {
    // reload data on message with reload status
    if (event.data.status === "reload") {
      $scope.loadAbsences();
    };
  });


  // -- Native navigation

  // Set navigation bar..
  steroids.view.navigationBar.show("Absence index");

  // ..and add a button to it
  var addButton = new steroids.buttons.NavigationBarButton();
  addButton.title = "Add";

  // ..set callback for tap action
  addButton.onTap = function() {
    var addView = new steroids.views.WebView("/views/absence/new.html");
    steroids.modal.show(addView);
  };

  // and finally put it to navigation bar
  steroids.view.navigationBar.setButtons({
    right: [addButton]
  });


});


// Show: http://localhost/views/absence/show.html?id=<id>

absenceApp.controller('ShowCtrl', function ($scope, AbsenceRestangular) {

  // Helper function for loading absence data with spinner
  $scope.loadAbsence = function() {
    $scope.loading = true;

     absence.get().then(function(data) {
       $scope.absence = data;
       $scope.loading = false;
    });

  };

  // Save current absence id to localStorage (edit.html gets it from there)
  localStorage.setItem("currentAbsenceId", steroids.view.params.id);

  var absence = AbsenceRestangular.one("absence", steroids.view.params.id);
  $scope.loadAbsence()

  // When the data is modified in the edit.html, get notified and update (edit is on top of this view)
  window.addEventListener("message", function(event) {
    if (event.data.status === "reload") {
      $scope.loadAbsence()
    };
  });

  // -- Native navigation
  steroids.view.navigationBar.show("Absence: " + steroids.view.params.id );

  var editButton = new steroids.buttons.NavigationBarButton();
  editButton.title = "Edit";

  editButton.onTap = function() {
    webView = new steroids.views.WebView("/views/absence/edit.html");
    steroids.modal.show(webView);
  }

  steroids.view.navigationBar.setButtons({
    right: [editButton]
  });


});


// New: http://localhost/views/absence/new.html

absenceApp.controller('NewCtrl', function ($scope, AbsenceRestangular) {

  $scope.close = function() {
    steroids.modal.hide();
  };

  $scope.create = function(absence) {
    $scope.loading = true;

    AbsenceRestangular.all('absence').post(absence).then(function() {

      // Notify the index.html to reload
      var msg = { status: 'reload' };
      window.postMessage(msg, "*");

      $scope.close();
      $scope.loading = false;

    }, function() {
      $scope.loading = false;

      alert("Error when creating the object, is Restangular configured correctly, are the permissions set correctly?");

    });

  }

  $scope.absence = {};

});


// Edit: http://localhost/views/absence/edit.html

absenceApp.controller('EditCtrl', function ($scope, AbsenceRestangular) {

  var id  = localStorage.getItem("currentAbsenceId"),
      absence = AbsenceRestangular.one("absence", id);

  $scope.close = function() {
    steroids.modal.hide();
  };

  $scope.update = function(absence) {
    $scope.loading = true;

    absence.put().then(function() {

      // Notify the show.html to reload data
      var msg = { status: "reload" };
      window.postMessage(msg, "*");

      $scope.close();
      $scope.loading = false;
    }, function() {
      $scope.loading = false;

      alert("Error when editing the object, is Restangular configured correctly, are the permissions set correctly?");
    });

  };

  // Helper function for loading absence data with spinner
  $scope.loadAbsence = function() {
    $scope.loading = true;

    // Fetch a single object from the backend (see app/models/absence.js)
    absence.get().then(function(data) {
      $scope.absence = data;
      $scope.loading = false;
    });
  };

  $scope.loadAbsence();

});