var flagApp = angular.module('flagApp', ['FlagModel', 'hmTouchevents']);


// Index: http://localhost/views/flag/index.html

flagApp.controller('IndexCtrl', function ($scope, FlagRestangular) {

  // This will be populated with Restangular
  $scope.flags = [];

  // Helper function for opening new webviews
  $scope.open = function(id) {
    webView = new steroids.views.WebView("/views/flag/show.html?id="+id);
    steroids.layers.push(webView);
  };

  // Helper function for loading flag data with spinner
  $scope.loadFlags = function() {
    $scope.loading = true;

    flags.getList().then(function(data) {
      $scope.flags = data;
      $scope.loading = false;
    });

  };

  // Fetch all objects from the backend (see app/models/flag.js)
  var flags = FlagRestangular.all('flag');
  $scope.loadFlags();


  // Get notified when an another webview modifies the data and reload
  window.addEventListener("message", function(event) {
    // reload data on message with reload status
    if (event.data.status === "reload") {
      $scope.loadFlags();
    };
  });


  // -- Native navigation

  // Set navigation bar..
  steroids.view.navigationBar.show("Flag index");

  // ..and add a button to it
  var addButton = new steroids.buttons.NavigationBarButton();
  addButton.title = "Add";

  // ..set callback for tap action
  addButton.onTap = function() {
    var addView = new steroids.views.WebView("/views/flag/new.html");
    steroids.modal.show(addView);
  };

  // and finally put it to navigation bar
  steroids.view.navigationBar.setButtons({
    right: [addButton]
  });


});


// Show: http://localhost/views/flag/show.html?id=<id>

flagApp.controller('ShowCtrl', function ($scope, FlagRestangular) {

  // Helper function for loading flag data with spinner
  $scope.loadFlag = function() {
    $scope.loading = true;

     flag.get().then(function(data) {
       $scope.flag = data;
       $scope.loading = false;
    });

  };

  // Save current flag id to localStorage (edit.html gets it from there)
  localStorage.setItem("currentFlagId", steroids.view.params.id);

  var flag = FlagRestangular.one("flag", steroids.view.params.id);
  $scope.loadFlag()

  // When the data is modified in the edit.html, get notified and update (edit is on top of this view)
  window.addEventListener("message", function(event) {
    if (event.data.status === "reload") {
      $scope.loadFlag()
    };
  });

  // -- Native navigation
  steroids.view.navigationBar.show("Flag: " + steroids.view.params.id );

  var editButton = new steroids.buttons.NavigationBarButton();
  editButton.title = "Edit";

  editButton.onTap = function() {
    webView = new steroids.views.WebView("/views/flag/edit.html");
    steroids.modal.show(webView);
  }

  steroids.view.navigationBar.setButtons({
    right: [editButton]
  });


});


// New: http://localhost/views/flag/new.html

flagApp.controller('NewCtrl', function ($scope, FlagRestangular) {

  $scope.close = function() {
    steroids.modal.hide();
  };

  $scope.create = function(flag) {
    $scope.loading = true;

    FlagRestangular.all('flag').post(flag).then(function() {

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

  $scope.flag = {};

});


// Edit: http://localhost/views/flag/edit.html

flagApp.controller('EditCtrl', function ($scope, FlagRestangular) {

  var id  = localStorage.getItem("currentFlagId"),
      flag = FlagRestangular.one("flag", id);

  $scope.close = function() {
    steroids.modal.hide();
  };

  $scope.update = function(flag) {
    $scope.loading = true;

    flag.put().then(function() {

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

  // Helper function for loading flag data with spinner
  $scope.loadFlag = function() {
    $scope.loading = true;

    // Fetch a single object from the backend (see app/models/flag.js)
    flag.get().then(function(data) {
      $scope.flag = data;
      $scope.loading = false;
    });
  };

  $scope.loadFlag();

});