angular.module('Send',['capitalizeFirst','titleService','Datehelper'])

.service('SendService', function($dialog, Clients) {

    this.sendSMS = function(data) {
    var d = $dialog.dialog({dialogFade: false, resolve: {entity: function(){return new Clients(data);}}});
        d.open('clients/send/send.tpl.html', 'SendSMSCtrl');
    };
})

.controller('SendSMSCtrl',['$scope','$http','dialog','titleService','entity', function SendSMSCtrl($scope,$http,dialog,titleService,entity) {
  titleService.setTitle ('Send SMS');

  $scope.cancel = function() {
    dialog.close('cancel');
  };

  $scope.submit = function() {
    $http({method: 'POST', url: '/sms', data: { from:'+13314723933', to:'+1'+entity.telephone, message:$scope.message }})
      .success(function(data) {
        console.log("Message successfully sent");
      })
      .error(function(data, status) {
        alert("Your message could not be sent!");
      });
      dialog.close();
  };

  $scope.toggleSpanish = function() {
    $scope.message = "Me gusta Espanol";
  };

  $scope.toggleEnglish = function() {
    $scope.message = "Hello " + entity.firstname + " your payment is due on " + new Date(entity.paymenttaken).toDateString() +
    ", your phone will expire soon, please call or come visit us to pay your bill !" + "\n" +"\n" +"Thanks,"+"\n"+"Telekom 773-774-7000";
  };

  $scope.togglePolish = function() {
    var date = new Date(entity.paymenttaken);
    var day = date.getDay();
    var month = date.getMonth();
    var dayhash = ['Poniedzialek','Wtorek','Sroda','Czwartek','Piatek','Sobota','Niedziela'];
    var monthhash = ['Styczena','Lutego','Marca','Kwietnia','Maja','Czerwca','Lipca','Sierpnia','Wrzesnia','Pazdziernika','Listopada','Grudnia'];
    var stringdate = date.getDate() + '/' + dayhash[day] + '/ ' + monthhash[month];
    $scope.message = "Witam " + entity.firstname + ". Twoj serwis tel. wygasa " + stringdate +
     '. Prosze przyjdz lub zadzwon do Telekomu aby zaplacic za swoj telefon.'+ "\n" +"\n"+"Telekom"+"\n"+ "773-774-7000";
  };

  $scope.togglePolish();

}]);
