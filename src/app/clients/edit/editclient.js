angular.module('newClient',['capitalizeFirst','titleService','Resources','Datehelper'])

.service('dialogService', function($dialog, Clients) {
    this.newClientwithData = function(data,callback) {
    var d = $dialog.dialog({dialogFade: false, resolve: {entity: function(){return new Clients(data); }, isNew: function() {return true;}}});
        d.open('clients/edit/editclient.tpl.html', 'EditClientCtrl').then(function(result){callback(result);});
    };

    this.newClient = function(callback) {
		var d = $dialog.dialog({dialogFade: false, resolve: {entity: function(){return new Clients(); }, isNew: function() {return true;}}});
        d.open('clients/edit/editclient.tpl.html', 'EditClientCtrl').then(function(result){callback(result);});
    };

    this.editClient = function(data,callback) {
		var d = $dialog.dialog({dialogFade: false, resolve: {entity: function(){return new Clients(data);}, isNew: function() {return false;}}});
        d.open('clients/edit/editclient.tpl.html', 'EditClientCtrl').then(function(result){callback(result);});
    };
})

.controller('EditClientCtrl', ['$scope', 'titleService', 'dialog', 'entity', 'isNew', 'DateHelp', function EditClientController($scope, titleService, dialog, entity, isNew, DateHelp) {
  if (isNew) {
    $scope.editnew = 'New';
    titleService.setTitle ('New Client');
  }
  else {
    $scope.editnew = 'Edit';
    titleService.setTitle ('Edit Client');
  }

  $scope.carriers = [{carrier:'Ultra Mobile',plans:['19','29','39','49','59']},
      {carrier:'Simple Mobile',plans:['25','40','50','60','50 I.L.D.','60 I.L.D.','70 I.L.D.','Prepaid']},
      {carrier:'T-Mobile',plans:['Prepaid','30 Monthly','50 Monthly','60 Monthly','70 Monthly','100 Monthly']},
      {carrier:'Page Plus',plans:['29.95','39.95']},
      {carrier:'h20',plans:['30','40','50','60','Pay-as-You-Go']}, 
      {carrier:'Verizon Wireless',plans:['Prepaid']},
      {carrier:'GO Smart',plans:['30','35','45']},
      {carrier:'Lyca Mobile',plans:['29','39','49']},
      {carrier:'AT&T',plans:['Prepaid']},
      {carrier:'Red Pocket',plans:['19.99','29.99','39.99','49.99','59.99','PayGo']}
    ];

    $scope.$watch('newuser.carrier', function(newValue) {
      $scope.plans = getPlanByCarrier(newValue);
    });


  function getPlanByCarrier( value ) {
    for ( var i = $scope.carriers.length-1 ; i >= 0 ; i-- ) {
      if ( $scope.carriers[i].carrier === value ) {
        return( $scope.carriers[i].plans );
      }
    }
    return( null );
  }

  $scope.newuser = entity;
  var today;
  /* FORMAT INITIAL VALUE FOR DATE */
  if(isNew) {
    $scope.newuser.paymenttaken = DateHelp.getNextMonth();
  } else {
    console.log($scope.newuser.paymenttaken);
    today = new Date($scope.newuser.paymenttaken);
    dd = today.getDate();
    mm = today.getMonth()+1;
    yyyy = today.getFullYear();
    if(dd<10){dd='0'+dd;}
    if(mm<10){mm='0'+mm;}
    $scope.newuser.paymenttaken = yyyy+'-'+mm+'-'+dd;
  }

  $scope.submit = function() {
    if (isNew) {
      $scope.newuser.$save(function(data) {
        dialog.close($scope.newuser);      
      }, function(error) {
        $scope.error = error; 
      });
    }
    else {
      $scope.newuser.$up(function(data) {
        dialog.close($scope.newuser);      
      }, function(error) {
        $scope.error = error; 
      });
    }
    
  };

  $scope.cancel = function() {
    dialog.close('cancel');
  };

  $scope.keypressCallback = function ($event) {
    $scope.submit();
  };

}]);

