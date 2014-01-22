var calenderApp = angular.module('calenderApp', ['AppointmentModel', 'hmTouchevents', 'ShiftModel']);

calenderApp.controller('IndexCtrl', function ($scope, AppointmentRestangular,ShiftRestangular) {

     $scope.shifts = [];

    // Helper function for loading shift data with spinner
  $scope.loadShifts = function() {
    $scope.loading = true;

    shifts.getList().then(function(data) {
      $scope.shifts = data;
      $scope.loading = false;
    });

  };

  // Fetch all objects from the backend (see app/models/appointment.js)
  var shifts = ShiftRestangular.all('shift');
  $scope.loadShifts();


   today =new Date();
   $scope.dates = getDaysInMonth(today.getMonth(), today.getFullYear());

function getDaysInMonth(month, year) {
     var date = new Date(year, month, 1);
     var days = [];
     while (date.getMonth() === month) {
        var utcDay = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 00, 00, 00);
        days.push(utcDay);
        date.setDate(date.getDate() + 1);
     }

     return days;
}

  // Helper function for opening new webviews
  $scope.open = function(date) {
    localStorage.setItem("currentDate", date);
    webView = new steroids.views.WebView("/views/calender/new.html");
    steroids.layers.push(webView);
  };



  // This will be populated with Restangular
  $scope.appointments = [];


  // Helper function for loading appointment data with spinner
  $scope.loadAppointments = function() {
    $scope.loading = true;

    appointments.getList().then(function(data) {
      $scope.appointments = data;
      $scope.loading = false;
    });

  };

  // Fetch all objects from the backend (see app/models/appointment.js)
  var appointments = AppointmentRestangular.all('appointment');
  $scope.loadAppointments();


  // Get notified when an another webview modifies the data and reload
  window.addEventListener("message", function(event) {
    // reload data on message with reload status
    if (event.data.status === "reload") {
      $scope.loadAppointments();
    };
  });


    // Set navigation bar..
  steroids.view.navigationBar.show("Kalender");


});

calenderApp.controller('NewCtrl', function ($scope, AppointmentRestangular,ShiftRestangular) {

  $scope.shifts = [];


    // Helper function for loading shift data with spinner
  $scope.loadShifts = function() {
    $scope.loading = true;

    shifts.getList().then(function(data) {
      $scope.shifts = data;
      $scope.loading = false;
    });

  };

  // Fetch all objects from the backend (see app/models/appointment.js)
  var shifts = ShiftRestangular.all('shift');
  $scope.loadShifts();

  $scope.date =localStorage.getItem("currentDate");


  $scope.close = function() {
    steroids.layers.pop();
    steroids.modal.hide();
  };

  $scope.create = function(date,shift) {
    var appointment = {};
    appointment.date = date;
    appointment.appointment_to_shift = shift;

    $scope.loading = true;
    //alert(JSON.stringify(appointment));

    AppointmentRestangular.all('appointment').post(appointment).then(function() {

      // Notify the index.html to reload
      var msg = { status: 'reload' };
      window.postMessage(msg, "*");

    steroids.layers.pop();
        $scope.loading = false;


    }, function() {
      $scope.loading = false;

      alert("Error when creating the object, is Restangular configured correctly, are the permissions set correctly?");

    });

  }

  $scope.appointment = {};

});
