var shiftApp = angular.module('shiftApp', ['ShiftModel', 'hmTouchevents']);


// Index: http://localhost/views/shift/index.html

shiftApp.controller('IndexCtrl', function ($scope, ShiftRestangular) {

  // This will be populated with Restangular
  $scope.shifts = [];

  // Helper function for opening new webviews
  $scope.open = function(id) {
    webView = new steroids.views.WebView("/views/shift/show.html?id="+id);
    steroids.layers.push(webView);
  };

  // Helper function for loading shift data with spinner
  $scope.loadShifts = function() {
    $scope.loading = true;

    shifts.getList().then(function(data) {
      $scope.shifts = data;
      $scope.loading = false;
    });

  };

  // Fetch all objects from the backend (see app/models/shift.js)
  var shifts = ShiftRestangular.all('shift');
  $scope.loadShifts();


  // Get notified when an another webview modifies the data and reload
  window.addEventListener("message", function(event) {
    // reload data on message with reload status
    if (event.data.status === "reload") {
      $scope.loadShifts();
    };
  });


  // -- Native navigation

  // Set navigation bar..
  steroids.view.navigationBar.show("Shift index");

  // ..and add a button to it
  var addButton = new steroids.buttons.NavigationBarButton();
  addButton.title = "Add";

  // ..set callback for tap action
  addButton.onTap = function() {
    var addView = new steroids.views.WebView("/views/shift/new.html");
    steroids.modal.show(addView);
  };

  // and finally put it to navigation bar
  steroids.view.navigationBar.setButtons({
    right: [addButton]
  });


});


// Show: http://localhost/views/shift/show.html?id=<id>

shiftApp.controller('ShowCtrl', function ($scope, ShiftRestangular) {

  // Helper function for loading shift data with spinner
  $scope.loadShift = function() {
    $scope.loading = true;

     shift.get().then(function(data) {
       $scope.shift = data;
       $scope.loading = false;
    });

  };

  // Save current shift id to localStorage (edit.html gets it from there)
  localStorage.setItem("currentShiftId", steroids.view.params.id);

  var shift = ShiftRestangular.one("shift", steroids.view.params.id);
  $scope.loadShift()

  // When the data is modified in the edit.html, get notified and update (edit is on top of this view)
  window.addEventListener("message", function(event) {
    if (event.data.status === "reload") {
      $scope.loadShift()
    };
  });

  // -- Native navigation
  steroids.view.navigationBar.show("Shift: " + steroids.view.params.id );

  var editButton = new steroids.buttons.NavigationBarButton();
  editButton.title = "Edit";

  editButton.onTap = function() {
    webView = new steroids.views.WebView("/views/shift/edit.html");
    steroids.modal.show(webView);
  }

  steroids.view.navigationBar.setButtons({
    right: [editButton]
  });


});


// New: http://localhost/views/shift/new.html

shiftApp.controller('NewCtrl', function ($scope, ShiftRestangular) {
   $scope.vals = [
{name:'1', value:"1"},
{name:'2', value:"2"},
{name:'3', value:"3"},
{name:'4', value:"4"},
{name:'5', value:"5"}
]; 



  $scope.close = function() {
    steroids.modal.hide();
  };

  $scope.create = function(shift) {
    $scope.loading = true;

    
    ShiftRestangular.all('shift').post(shift).then(function() {

      // Notifyhttps://github.com/ the index.html to reload
      var msg = { status: 'reload' };
      window.postMessage(msg, "*");

      $scope.close();
      $scope.loading = false;

    }, function() {
      $scope.loading = false;

      alert("Error when creating the object, is Restangular configured correctly, are the permissions set correctly?");

    });

  }

  $scope.shift = {};

});


// Edit: http://localhost/views/shift/edit.html

shiftApp.controller('EditCtrl', function ($scope, ShiftRestangular) {

  var id  = localStorage.getItem("currentShiftId"),
      shift = ShiftRestangular.one("shift", id);

  $scope.close = function() {
    steroids.modal.hide();
  };

  $scope.update = function(shift) {
    $scope.loading = true;

    shift.put().then(function() {

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

  // Helper function for loading shift data with spinner
  $scope.loadShift = function() {
    $scope.loading = true;

    // Fetch a single object from the backend (see app/models/shift.js)
    shift.get().then(function(data) {
      $scope.shift = data;
      $scope.loading = false;
    });
  };

  $scope.loadShift();

});