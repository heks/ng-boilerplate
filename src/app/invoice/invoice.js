angular.module( 'ngBoilerplate.invoice', [
  'ui.state',
  'placeholders',
  'ui.bootstrap',
  'titleService',
  'telephonefilter',
  'newClient',
  'Resources',
  'security.authorization',
  'ui.utils'
])

.config([ '$stateProvider','securityAuthorizationProvider', function config( $stateProvider,securityAuthorizationProvider ) {
  $stateProvider.state( 'invoice', {
    url: '/invoice',
    views: {
      "main": {
        controller: 'InvoiceCtrl',
        templateUrl: 'invoice/invoice.tpl.html'
      }
    },
    resolve: {
      authenticatedUser: securityAuthorizationProvider.requireAuthenticatedUser,
      currentUser: ['security', function(security){
        return security.requestCurrentUser();  
      }]
      }
  });
}])

.controller( 'InvoiceCtrl', function InvoiceCtrl( $scope, currentUser, titleService,$state,Invoices,ConfirmService) {
  titleService.setTitle( 'Invoice' );
  $scope.transaction = {
    Type:'',
    amount:0,
    tax:false, //only on client side
    taxcost:0,     
    carrier:'',
    model:'',
    service:'',
    processed_by: currentUser.username,
    Description:''
  };

  $scope.printMode = false;
 
  $scope.processed = currentUser.firstname + ' ' + currentUser.lastname;
  /* info is carrier,model,service,description */

  var sample_invoice = {
			invoice_number:new Date().getTime(),
      grandtotal:0,
      subtotal:0,
			firstname: '',
			lastname:'',
			telephone: '',
			typeofpayment:'Cash',
      taxtotal:0,
      processed_by:currentUser.username,
      transactions:[]
  };


  var data = [['Boss Revolution','Net10','Simple Mobile'],
				['Ultra Mobile','Simple Mobile','T-Mobile','Page Plus','h20','Verizon Wireless','GO Smart','Lyca Mobile','AT&T','Red Pocket'],
				['Apple iPhone 3G 8GB RB Unlck','Apple iPhone 4G 8GB Unlck Quad Band','Samsung Galaxy 2','Samsung Galaxy 3 T999, T-Mobile RB',
          'Samsung Galaxy 4','Alcatel 606A T-Mobile RB','Alcatel 665, Flip T-Mobile RB','Samsung T139 (Gray)','Samsung T259 (Blue)',
          'Samsung GT-C3520 (PINK)','Samsung T459 White','T-Mobile ZTE V768 Concord','T-Mobile Garmin A50 Asus','Sony Ericsson Z550i','Blackberry 8320',
          'Alcatel 0T510A AT&T','Samsung i727 Skyrocket AT&T','Samsung SGH-C3520 GSM Flip','T-Mobile - LG GS170','T-Mobile - Nokia X2']];
/*
  { 'Activation':['Ultra Mobile','Simple Mobile','T-Mobile','Page Plus','h20','Verizon Wireless','GO Smart','Lyca Mobile','AT&T','Red Pocket']},
  { 'Phone Sale':['iPhone 5s','iPhone 5','Samsung Galaxy S3','Samsung Galaxy S4', 'iPhone4','iPhone4s','Other']}
  ];
*/

    $scope.invoice = sample_invoice;
  
    $scope.addPhoneBill = function() {
        $scope.invoice.transactions.push({Description:'', Choices:data[1], Type:'Phone Bill', amount:40.00});    
    };

    $scope.addActivation = function() {
        $scope.invoice.transactions.push({Description:'', Choices:data[1], Type:'Activation', amount:25.00});    
    };

    $scope.addPhoneSale = function() {
        $scope.invoice.transactions.push({Description:'', Choices:data[2], Type:'Phone Sale', amount:9.95});    
    };

    $scope.addInternational = function() {
        $scope.invoice.transactions.push({Description:'', Choices:data[0], Type:'International', amount:20.00});    
    };    

    $scope.addOther = function() {
        $scope.invoice.transactions.push({Description:'', taxcost:0, Choices:false, Type:'Other', amount:9.95});    
    };

    $scope.addUtil = function() {
		$scope.invoice.transactions.push({Description:'', taxcost:0, Choices:false, Type:'Utilities', amount:9.95});
    };

    $scope.removetransaction = function(transaction) {
        $scope.invoice.transactions.splice($scope.invoice.transactions.indexOf(transaction), 1);    
    };

    $scope.toggleTax = function(transaction) {
      transaction.taxcost = transaction.tax ? Math.round(transaction.amount*0.0925*100)/100 : 0;
    };
    
    $scope.invoice_sub_total = function() {
      var total = 0.00;
      angular.forEach($scope.invoice.transactions, function(transaction, key){
        total += (transaction.amount);
      });
      $scope.invoice.subtotal = total;
      return total;
    };
    $scope.calculate_tax = function() {
      var total = 0.00;
      angular.forEach($scope.invoice.transactions, function(transaction, key){
      if(transaction.tax) {
        total += transaction.taxcost;
      }
      });
      $scope.invoice.taxtotal = total;
      return total;
    };
    $scope.calculate_grand_total = function() {
      var total = $scope.calculate_tax() + $scope.invoice_sub_total();
      $scope.invoice.grandtotal = Math.round(total*100)/100;
      return total;
    }; 

    $scope.submitInfo = function() {
      angular.forEach($scope.invoice.transactions, function(transaction, key){
        delete transaction['Choices'];
      });
      /*
      var newinvoice = new Invoices($scope.invoice);
      newinvoice.$save(function(data,getResponseHeaders) { 
        console.log("Successfully submitted" + data);
      }, function(data,getResponseHeaders) {
        console.log("Could not POST  " + data + '  '+getResponseHeaders );
      });
      */
      ConfirmService.confirm($scope.invoice);
    };

    $scope.printInfo = function (){
      window.print();
    };

    $scope.clearInfo = function(){
      $scope.invoice.transactions = [];
      $scope.invoice.firstname = '';
      $scope.invoice.lastname = '';
      $scope.invoice.telephone = '';
      $scope.invoice.typeofpayment='Cash';
      $scope.new_invoice_num();
    };

    $scope.new_invoice_num = function() {
      $scope.invoice.invoice_number = new Date().getTime();
    };

    //ConfirmService.confirm($scope.newtransaction);

    /*
    $scope.$watch('invoice', function(){
      console.log("Changed invoice");
      $scope.new_invoice_num();
    });
    */

})

.service('ConfirmService', function($dialog, Invoices) {
    this.confirm = function(data) {
      var d = $dialog.dialog({dialogFade: false, resolve: {entity: function(){return new Invoices(data);}}});
      d.open('invoice/confirm.tpl.html', 'ConfirmCtrl').then(function(result){
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