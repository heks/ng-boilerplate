angular.module( 'ngBoilerplate.transactions', [
  'ui.state',
  'placeholders',
  'ui.bootstrap',
  'titleService',
  'telephonefilter',
  'newClient',
  'security',
  'ui.utils'
])

.config([ '$stateProvider','securityAuthorizationProvider', function config( $stateProvider, securityAuthorizationProvider ) {
  $stateProvider.state( 'transactions', {
    url: '/transactions',
    abstract:true,
    views: {
      "main": {
        controller: 'TransactionCtrl',
        templateUrl: 'transaction/transaction.tpl.html'
      }
    },
    resolve: {
      authenticatedUser: securityAuthorizationProvider.requireAuthenticatedUser
    }
  })
  .state('transactions.telephonepayments', {
    url: "/telephonepayments",
    templateUrl: "transaction/views/telephonepayments.tpl.html",
    controller:'telephonePaymentsCtrl'
  })
  .state('transactions.activation', {
    url: "/activation",
    templateUrl: "transaction/views/activation.tpl.html",
    controller:'ActivationCtrl'
  })
  .state('transactions.phonesales', {
    url: "/phonesales",
    templateUrl: "transaction/views/phonesales.tpl.html",
    controller:'phonesalesCtrl'
  })
  .state('transactions.utilities', {
    url: "/utilities",
    templateUrl: "transaction/views/utilities.tpl.html",
    controller:'utilitiesCtrl'
  })
  .state('transactions.international', {
    url: "/international",
    templateUrl: "transaction/views/inter.tpl.html",
    controller:'internationalCtrl'
  })
  .state('transactions.other', {
    url: "/other",
    templateUrl: "transaction/views/other.tpl.html",
    controller:'otherCtrl'
  });
}])

.controller( 'TransactionCtrl', function TransactionCtrl( $scope, titleService, ConfirmService ) {
  titleService.setTitle( 'New Transaction' );
  $scope.transaction = {
    Type:'',
    credit:'cash',
    date:new Date().toISOString(),
    amount:'',
    carrier:'',
    telephone:'',
    model:'',
    service:'',
    Description:''
  };

  $scope.submit_transaction = function() {
    $scope.newtransaction = {};
    $scope.newtransaction.Type = $scope.transaction.Type;
    $scope.newtransaction.credit = $scope.transaction.credit;
    $scope.newtransaction.date = $scope.transaction.date;
    $scope.newtransaction.amount = $scope.transaction.amount;
    if($scope.transaction.carrier !== '') {
      $scope.newtransaction.carrier = $scope.transaction.carrier;
    } if($scope.transaction.telephone !== '') {
      $scope.newtransaction.telephone = $scope.transaction.telephone;
    } if($scope.transaction.model !== '') {
      $scope.newtransaction.model = $scope.transaction.model;
    } if($scope.transaction.service !== '') {
      $scope.newtransaction.service = $scope.transaction.service;
    } if($scope.transaction.Description !== '') {
      $scope.newtransaction.Description = $scope.transaction.Description;
    }

    ConfirmService.confirm($scope.newtransaction);
  };

})

.controller( 'ActivationCtrl', function ActivationCtrl( Initialize,$scope, titleService, dialogService, Search,$filter ) {
  Initialize.init($scope.transaction);
  $scope.transaction.Type = 'Activation';
  titleService.setTitle( 'New Activation' );
  $scope.response = null;
  $scope.carriers = ['Ultra Mobile','Simple Mobile','T-Mobile','Page Plus',
    'h20','Verizon Wireless','GO Smart','Lyca Mobile','AT&T','Red Pocket'];

  $scope.keypressCallback = function ($event) {
    return;
  };

  $scope.submit = function(telephone) {
    Search.doSearch(telephone).then(function(data) {
      /* Found number in database */
      if(data.telephone==telephone) {
        $scope.response = null;
        dialogService.editClient(data, function(result){
          if (result === 'cancel'){
            $scope.alerttype = 'error';
            $scope.response = 'Did not edit client:  ';
          }
          else {
            $scope.alerttype = 'success';
            $scope.response = "Successfully edited client:  ";
            $scope.transaction.amount = 25.00;
            $scope.transaction.carrier = result.carrier;
          }
        });
      } else {
        dialogService.newClientwithData({'telephone':$scope.transaction.telephone},function(result){
          if (result === 'cancel') {
            $scope.alerttype = 'error';
            $scope.response = 'Did not create client:  ';
          }
          else {
            $scope.alerttype = 'success';
            $scope.response = "Successfully created new client:  ";
            $scope.transaction.carrier = result.carrier;
            $scope.transaction.amount = 35.00;
          }
        });  
      }
    });
  };

  $scope.$watch('transaction.telephone',function() {
    $scope.response = null;
  });

  $scope.closeAlert = function() {
    $scope.response = null;
  };


})

.controller( 'telephonePaymentsCtrl', function telephonePaymentsCtrl( Initialize,$scope,dialogService, titleService,Search,$filter ) {
  /* Initialization code */
  $scope.transaction.Type='Phone Bill';
  Initialize.init($scope.transaction);
  titleService.setTitle( 'Telephone Payment' );
  $scope.response = null;
  $scope.carriers = ['Ultra Mobile','Simple Mobile','T-Mobile','Page Plus','h20','Verizon Wireless','GO Smart','Lyca Mobile','AT&T','Red Pocket'];
  
  $scope.keypressCallback = function ($event) {
    $scope.submit();
  };

  $scope.predictAmt = function(amount) {
    if(amount <= 16) {
      return amount+1;
    } else if(amount == 29) {
      return amount+5;
    } else if (amount <= 35) {
      return amount+3;
    } else if (amount <= 39) {
      return amount+4;
    } else if (amount == 40) {
      return amount+3;
    } else if(amount <= 49) {
      return amount+5;
    } else if(amount == 50) {
      return amount+4;
    } else if(amount <= 55) {
      return amount+5;
    } else if(amount <= 59) {
      return amount+6;
    } else if(amount == 60) {
      return amount+4;
    } else if(amount <= 70) {
      return amount+6;
    } else {
      return 99;
    }
  };

  $scope.$watch('transaction.telephone',function() {
    $scope.closeAlert();
  });

  $scope.closeAlert = function() {
    $scope.response = null;
  };

  $scope.submit = function(telephone) {
    Search.doSearch(telephone).then(function(data) {
      if(data.telephone==telephone) {
        $scope.transaction.telephone = telephone; 
        $scope.response = data.firstname + ' ' + data.lastname + ' : ';
        $scope.alerttype = 'success';
        $scope.transaction.carrier=data.carrier;
        $scope.transaction.amount = $scope.predictAmt(parseInt(data.plan.replace( /^\D+/g, ''),10));
      } else {
        dialogService.newClientwithData({'telephone':$scope.transaction.telephone},function(result){
          if (result === 'cancel'){
            $scope.alerttype = 'error';
            $scope.response = 'Did not create client:  ';
          }
          else {
            $scope.transaction.amount = $scope.predictAmt(parseInt(result.plan.replace(/^\D+/g,''),10));
            $scope.alerttype = 'success';
            $scope.response = "Successfully created new client:  ";
            $scope.transaction.carrier = result.carrier;
          }
          titleService.setTitle('Telephone Payment');
        });  
      }
    });
  };
})

.controller( 'phonesalesCtrl', function phonesalesCtrl( $scope, titleService,Initialize ) {
  Initialize.init($scope.transaction);
  /* Initialization code */
  $scope.transaction.Type = 'Phone Sale';
  $scope.tax = false;
  titleService.setTitle( 'Phone Sales' );
  $scope.phones= ['iPhone 5s','iPhone 5','Samsung Galaxy S3','Samsung Galaxy S4', 'iPhone4','iPhone4s','Other'];

  $scope.toggleTax = function(tax) {
    $scope.transaction.amount = $scope.tax ? $scope.transaction.amount*1.0925 : $scope.transaction.amount/1.0925;
    $scope.transaction.amount = Math.round($scope.transaction.amount*100)/100;
  };

  $scope.keypressCallback = function ($event) {
    return;
  };
})

.controller( 'utilitiesCtrl', function utilitiesCtrl( Initialize,$scope, titleService ) {
  titleService.setTitle( 'Utilities Payment' );
  $scope.transaction.Type='Utilities';
  Initialize.init($scope.transaction);
  $scope.keypressCallback = function ($event) {
  };

})

.controller( 'internationalCtrl', function internationalCtrl( Initialize,$scope, titleService ) {
  $scope.transaction.Type='International';
  Initialize.init($scope.transaction);

  titleService.setTitle( 'International Calling' );
  $scope.icarriers = ['Boss Revolution','Net10','Simple Mobile'];
  $scope.keypressCallback = function ($event) {
    return;
  };

  $scope.toggleTax = function(tax) {
    $scope.transaction.amount = $scope.tax ? $scope.transaction.amount*1.0925 : $scope.transaction.amount/1.0925;
    $scope.transaction.amount = Math.round($scope.transaction.amount*100)/100;
  };

})

.controller( 'otherCtrl', function otherCtrl( $scope,Initialize, ConfirmService, titleService ) {
  $scope.tax = false;
  $scope.transaction.Type = 'Other';
  Initialize.init($scope.transaction);

  titleService.setTitle( 'Other' );

  $scope.toggleTax = function(tax) {
    $scope.transaction.amount = $scope.tax ? $scope.transaction.amount*1.0925 : $scope.transaction.amount/1.0925;
    $scope.transaction.amount = Math.round($scope.transaction.amount*100)/100;
  };

})

.factory('Initialize', function() {
  var x = {};
  x.init = function(transaction) {
  transaction.date = new Date().toISOString();
  transaction.carrier = '';
  transaction.telephone = '';
  transaction.model = '';
  transaction.service = '';
  transaction.Description = '';
  transaction.credit = 'cash';
  transaction.amount='';
  };
  return x;
})


.factory('Search',function( $http){

  var myTelephone = {};

  myTelephone.doSearch = function(telephone) {
    var url = '/find/'+telephone;
    var promise = $http.get(url).then(function (response) {
        console.log(response);
        return response.data;
      }, function(response){
        myTelephone.data = 'Couldn\'t find' + telephone;
        return myTelephone.data;
      });
      return promise;
    };

  return myTelephone;
})

.directive('decimalPlaces',function(){
    return {
        link:function(scope,ele,attrs){
            ele.bind('keypress',function(e){
                var newVal=$(this).val()+(e.charCode!==0?String.fromCharCode(e.charCode):'');
                if($(this).val().search(/(.*)\.[0-9][0-9]/)===0 && newVal.length>$(this).val().length){
                    e.preventDefault();
                }
            });
        }
    };
})

.factory('Transactions', function($resource) {
  return $resource("/transaction", //{id:'@_id'},
   {
   'query': {method: 'GET',params:{date:'today'}, isArry:true},
   'remove':{method: 'DELETE',params:{id:'@_id'}, headers: {'Content-Type': 'application/json'}},
   'save':   {method:'POST'}
   });
})

.service('ConfirmService', function($dialog,Transactions) {
    this.confirm = function(data) {
      var d = $dialog.dialog({dialogFade: false, resolve: {entity: function(){return new Transactions(data);}}});
      d.open('transaction/views/confirm.tpl.html', 'ConfirmCtrl').then(function(result){
        if(result == 'cancel') {
          console.log('Did not make transaction');
        }
        else {
          console.log('Successfully made transaction');
        }

      });
    };
})

.controller('ConfirmCtrl', ['$scope', 'dialog','entity', function ($scope,dialog,entity) {
  /* make the post request */
  $scope.submit = function() {
      entity.$save( function(data) {
        dialog.close(entity);
    }, function(error) {
      $scope.error = error;
    });
  };

  $scope.cancel = function() {
      dialog.close('cancel');
  };

}]);


/*
  $scope.submit = function() {
    if (isNew) {
      $scope.newuser.$save(function(data) {
        dialog.close($scope.newuser);      
      }, function(error) {
        $scope.error = error; 
      });
}*/
