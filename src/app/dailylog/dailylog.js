angular.module( 'ngBoilerplate.dailylog', [
  'ui.state',
  'placeholders',
  'ui.bootstrap',
  'titleService',
  'telephonefilter',
  'security',
  'ngBoilerplate.transactions',
  'ui.utils'
])

.config([ '$stateProvider','securityAuthorizationProvider', function config( $stateProvider, securityAuthorizationProvider ) {
  $stateProvider.state( 'dailylog', {
    url: '/dailylog',
    views: {
      "main": {
        controller: 'DailyLogCtrl',
        templateUrl: 'dailylog/dailylog.tpl.html'
      }
    },
    resolve: {
      authenticatedUser: securityAuthorizationProvider.requireAuthenticatedUser
    }
  });
}])

.controller( 'DailyLogCtrl', function TransactionCtrl( $scope, titleService, Transactions ) {
  titleService.setTitle( 'Daily Log' );
  
  $scope.credit_total = 0;
  $scope.cash_total = 0;
  $scope.total = 0;
  $scope.total_transactions = 0;
  
  $scope.getStats = function(data) {
    for(var i = data.length-1; i >= 0; i-- ) {
      if(data[i].credit) {
        $scope.credit_total += data[i].amount;
      } else {
        $scope.cash_total += data[i].amount;
      }
    }
    $scope.total = $scope.cash_total + $scope.credit_total;
    $scope.total_transactions = data.length;
  };

  $scope.todays_transactions = Transactions.query({date:'today'},function(data){
    $scope.getStats(data);
  });

  $scope.deleteTransaction = function(entity) {
    entity.$remove( {id:entity._id}, function(data) {
      console.log(data);
      if(data.credit) {
        $scope.credit_total -= data.amount;
      } else {
        $scope.cash_total -= data.amount;
      }
      $scope.total -= data.amount;
      $scope.total_transactions -= 1;
      $scope.todays_transactions = Transactions.query({date:'today'});
    });
  };

})

.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});