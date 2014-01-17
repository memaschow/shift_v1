var appointmentApp = angular.module('appointmentApp', ['AppointmentModel', 'hmTouchevents', 'ShiftModel']);


// Index: http://localhost/views/appointment/index.html

appointmentApp.controller('IndexCtrl', function ($scope, AppointmentRestangular) {


  // This will be populated with Restangular
  $scope.appointments = [];

  // Helper function for opening new webviews
  $scope.open = function(id) {
    webView = new steroids.views.WebView("/views/appointment/show.html?id="+id);
    steroids.layers.push(webView);
  };

  // Helper function for loading appointment data with spinner
  $scope.loadAppointments = function() {
    $scope.loading = true;

    appointments.getList().then(function(data) {
      $scope.appointments = data;
      $scope.loading = false;
    });

  };

  // Get notified when an another webview modifies the data and reload
  window.addEventListener("message", function(event) {
    // reload data on message with reload status
    if (event.data.status === "reload") {
      $scope.loadAppointments();
    };
  });


  // -- Native navigation

  // Set navigation bar..
  steroids.view.navigationBar.show("Appointment index");

  // ..and add a button to it
  var addButton = new steroids.buttons.NavigationBarButton();
  addButton.title = "Add";

  // ..set callback for tap action
  addButton.onTap = function() {
    var addView = new steroids.views.WebView("/views/appointment/new.html");
    steroids.modal.show(addView);
  };

  // and finally put it to navigation bar
  steroids.view.navigationBar.setButtons({
    right: [addButton]
  });


});



// Index: http://localhost/views/appointment/index.html

appointmentApp.controller('CalenderIndexCtrl', function ($scope, AppointmentRestangular) {



   today =new Date();
   $scope.dates = getDaysInMonth(today.getMonth(), today.getFullYear());

function getDaysInMonth(month, year) {
     var loopDate = new Date(year, month, 1);
     var days = [];
     //var appointments = AppointmentRestangular.all('appointment');
     //var appointmentslist= appointments.getList();

     while (loopDate.getMonth() === month) {
        var day = {};
        day.name = new Date(loopDate);
        //a = getAppointmentFromDate(loopDate.toString());
        //alert(localStorage.getItem(currentShiftId));
        //alert($scope.x);
        days.push(day);
        loopDate.setDate(loopDate.getDate() + 1);
     }

     return days;
}


/*function getAppointmentFromDate(date)
{
  appointments = AppointmentRestangular.all('appointment');
  var $scope.x={};
      appointments.getList().then(function(data) {
        $scope.appointments = data;

          var appointmentObject = _.find(data, function(data) {
          return data.date === date;
          });
            $scope.x = appointmentObject.appointment_to_shift;
            alert(x);
            //day.shift = x;
            //localStorage.setItem("currentShiftId", x);
            //return appointmentObject.appointment_to_shift;
            
      });
            
            
        //alert(id);
        //return appointmentId.appointment_to_shift;

      $scope.loading = false;
}*/

  // Helper function for opening new webviews
  $scope.open = function(date) {
    localStorage.setItem("currentDate", date);
    webView = new steroids.views.WebView("/views/appointment/newDate.html");
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


  // -- Native navigation

  // Set navigation bar..
  steroids.view.navigationBar.show("Appointment index");




});

appointmentApp.controller('NewDateCtrl', function ($scope, AppointmentRestangular,ShiftRestangular) {

  $scope.shifts = [];

  //todo: Here need to load shifts of this date. You can solve this via 


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




// Show: http://localhost/views/appointment/show.html?id=<id>

appointmentApp.controller('ShowCtrl', function ($scope, AppointmentRestangular) {

  // Helper function for loading appointment data with spinner
  $scope.loadAppointment = function() {
    $scope.loading = true;

     appointment.get().then(function(data) {
       $scope.appointment = data;
       $scope.loading = false;
    });

  };

  // Save current appointment id to localStorage (edit.html gets it from there)
  localStorage.setItem("currentAppointmentId", steroids.view.params.id);


  var appointment = AppointmentRestangular.one("appointment", steroids.view.params.id);
  $scope.loadAppointment()

  // When the data is modified in the edit.html, get notified and update (edit is on top of this view)
  window.addEventListener("message", function(event) {
    if (event.data.status === "reload") {
      $scope.loadAppointment()
    };
  });

  // -- Native navigation
  steroids.view.navigationBar.show("Appointment: " + steroids.view.params.id );

  var editButton = new steroids.buttons.NavigationBarButton();
  editButton.title = "Edit";

  editButton.onTap = function() {
    webView = new steroids.views.WebView("/views/appointment/edit.html");
    steroids.modal.show(webView);
  }

  steroids.view.navigationBar.setButtons({
    right: [editButton]
  });


});


// New: http://localhost/views/appointment/new.html

appointmentApp.controller('NewCtrl', function ($scope, AppointmentRestangular) {



  $scope.close = function() {
    steroids.modal.hide();
  };

  $scope.create = function(appointment) {
    $scope.loading = true;

    AppointmentRestangular.all('appointment').post(appointment).then(function() {

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

  $scope.appointment = {};

});


// Edit: http://localhost/views/appointment/edit.html

appointmentApp.controller('EditCtrl', function ($scope, AppointmentRestangular) {

  var id  = localStorage.getItem("currentAppointmentId"),
      appointment = AppointmentRestangular.one("appointment", id);

  $scope.close = function() {
    steroids.modal.hide();
  };

  $scope.update = function(appointment) {
    $scope.loading = true;

    appointment.put().then(function() {

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

  // Helper function for loading appointment data with spinner
  $scope.loadAppointment = function() {
    $scope.loading = true;

    // Fetch a single object from the backend (see app/models/appointment.js)
    appointment.get().then(function(data) {
      $scope.appointment = data;
      $scope.loading = false;
    });
  };

  $scope.loadAppointment();

});