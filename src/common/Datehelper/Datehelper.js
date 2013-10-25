angular.module('Datehelper',[]).factory('DateHelp', function() {
    var Datehelper = {};
      Datehelper.getNextMonth = function() {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+2; //January is 0! // Make theis button one month from the current date.
        var yyyy = today.getFullYear();
        today = new Date(yyyy,mm,dd);
        dd = today.getDate();
        mm = today.getMonth();
        yyyy = today.getFullYear();
        if(dd<10){dd='0'+dd;}
        if(mm<10){mm='0'+mm;}
        today = yyyy+'-'+mm+'-'+dd;
        return today;
      };
      Datehelper.getToday = function() {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0! // Make theis button one month from the current date.
        var yyyy = today.getFullYear();
        today = new Date(yyyy,mm,dd);
        dd = today.getDate();
        mm = today.getMonth();
        yyyy = today.getFullYear();
        if(dd<10){dd='0'+dd;}
        if(mm<10){mm='0'+mm;}
        today = yyyy+'-'+mm+'-'+dd;
        return today;
      };
    return Datehelper;
});