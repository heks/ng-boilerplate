/**
 * Each section of the site has its own module. It probably also has
 * submodules, though this boilerplate is too simple to demonstrate it. Within
 * `src/app/home`, however, could exist several additional folders representing
 * additional modules that would then be listed as dependencies of this one.
 * For example, a `note` section could have the submodules `note.create`,
 * `note.delete`, `note.edit`, etc.
 *
 * Regardless, so long as dependencies are managed correctly, the build process
 * will automatically take take of the rest.
 *
 * The dependencies block here is also where component dependencies should be
 * specified, as shown below.
 */
angular.module( 'ngBoilerplate.clients', [
  'ui.state',
  'titleService',
  'ngGrid',
  'telephonefilter',
  'Datehelper',
  'Send',
  'security',
  'newClient'
])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(['$stateProvider','securityAuthorizationProvider',function config( $stateProvider,securityAuthorizationProvider ) {
  $stateProvider.state( 'clients',  {
    url:'/clients',
    views: {
      "main": {
        controller: 'ClientsCtrl',
        templateUrl: 'clients/clients.tpl.html'
      }
    },
    resolve: {
      authenticatedUser: securityAuthorizationProvider.requireAuthenticatedUser
    }
  });
}])
/**
 * And of course we define a controller for our route.
 */
.controller( 'ClientsCtrl', function ClientsCtrl($scope,titleService,SendService,$dialog,Clients,dialogService,DateHelp) {

  /* NG GRID CODE */ 
  /*
  $scope.filterOptions = {
        filterText: "",
        useExternalFilter: true
    };
    $scope.totalServerItems = 0;
    $scope.pagingOptions = {
        pageSize: 12,
        currentPage: 1
    };  
    $scope.setPagingData = function(data, page, pageSize){  
        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
        $scope.myData = pagedData;
        $scope.totalServerItems = data.length;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    $scope.getPagedDataAsync = function (pageSize, page, searchText) {
        setTimeout(function () {
            var data;
            if (searchText) {
                var ft = searchText.toLowerCase();
                Clients.query(function (largeLoad) {    
                    data = largeLoad.filter(function(item) {
                        return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                    });
                    $scope.setPagingData(data,page,pageSize);
                });            
            } else {
                Clients.query(function (largeLoad) {        
                    $scope.setPagingData(largeLoad,page,pageSize);
                });
            }
        }, 100);
    };
  
    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
  
    $scope.$watch('pagingOptions', function (newVal, oldVal) {
        if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);
    $scope.$watch('filterOptions', function (newVal, oldVal) {
        if (newVal !== oldVal) {
          console.log(newVal);
          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);
  */

  today = DateHelp.getNextMonth();
/*
  $scope.gridOptions = {
      data: 'myData',
      enablePaging: true,
      showFooter: true,
      totalServerItems:'totalServerItems',
      pagingOptions: $scope.pagingOptions,
      filterOptions: $scope.filterOptions
  };*/

  $scope.users = Clients.query();
  
  titleService.setTitle('Clients');
  $scope.gridOptions = {
      data: 'users',
//      enablePaging: true,
//      showFooter: true,
//      totalServerItems:'totalServerItems',
//      pagingOptions: $scope.pagingOptions,
//      filterOptions: $scope.filterOptions,
      columnDefs: [
          {field: 'firstname', displayName: 'First Name' },
          {field: 'lastname', displayName: 'Last Name'},
          {field: 'telephone', displayName: 'Telephone', width:'158px', sortable:false,groupable:false, cellTemplate:'<div class="ngCellText">{{row.getProperty(col.field) | tel}}<a><button class="btn btn-mini" ng-click="sendSMS(row.entity)" id="sms"><i class="icon-mobile-phone icon-mini"></i> SMS</button></a></div>'},
          {field: 'paymenttaken', displayName: 'Payment Date', cellTemplate:'<div class="ngCellText">{{row.getProperty(col.field) | date:"yyyy-MM-dd"}}  <a><i id="calendaricon" class="icon-calendar" ng-click="changeDate(row.entity)"></i></a></div>'},
          {field: 'carrier', displayName: 'Carrier', sortable:false,groupable:false,resizable:false},
          {field: 'plan', displayName: 'Plan', sortable:false,groupable:false,resizable:false},
          {displayName: '', width:'78px', sortable:false, cellTemplate: "<a ng-click='editClient(row.entity)'><i class='icon-pencil icon-large pull-left' id='pencilicon'></i></a> <a ng-click='deleteClient(row.entity)'><i class='icon-trash icon-large pull-right' id='trashicon'></i></a>"}
      ],
      rowHeight: 35,
      multiSelect: false,
      enableRowSelection: false, 
      showFilter: true
  };

  /*

    $scope.gridOptions = {
      data: 'users',
      rowHeight: 35,
        columnDefs: [
          {field: 'firstname', displayName: 'First Name' },
          {field: 'lastname', displayName: 'Last Name'},
          {field: 'telephone', displayName: 'Telephone', width:'158px', sortable:false,groupable:false, cellTemplate:'<div class="ngCellText">{{row.getProperty(col.field) | tel}}<a><button class="btn btn-mini" ng-click="sendSMS(row.entity)" id="sms"><i class="icon-mobile-phone icon-mini"></i> SMS</button></a></div>'},
          {field: 'paymenttaken', displayName: 'Next Payment Date', cellTemplate:'<div class="ngCellText">{{row.getProperty(col.field) | date:"yyyy-MM-dd"}}  <a><i id="calendaricon" class="icon-calendar" ng-click="changeDate(row.entity)"></i></a></div>'},
          {field: 'carrier', displayName: 'Carrier', sortable:false,groupable:false,resizable:false},
          {field: 'plan', displayName: 'Plan', sortable:false,groupable:false,resizable:false},
          {displayName: '', width:'78px', sortable:false, cellTemplate: "<a ng-click='editClient(row.entity)'><i class='icon-pencil icon-large pull-left' id='pencilicon'></i></a> <a ng-click='deleteClient(row.entity)'><i class='icon-trash icon-large pull-right' id='trashicon'></i></a>"}
        ],
      multiSelect: false,
      enableRowSelection: false, 
      showFilter: true
    };
  */
    
    $scope.editClient = function(entity) {
      dialogService.editClient(entity, function(result){
        if (result === 'cancel'){}
        else {
          $scope.users = Clients.query();
        }
          titleService.setTitle( 'Clients' );
        });  
      };

    $scope.newClient = function() {
      dialogService.newClient( function(result){
        if (result === 'cancel'){}
        else {
          $scope.users = Clients.query();
        }
          titleService.setTitle( 'Clients' );
        });  
    };

    $scope.deleteClient = function(entity) {
      entity.$remove (function() {
        $scope.users = Clients.query();
      });
    };

    $scope.changeDate = function(entity) {
      $scope.newuser = entity;
      $scope.newuser.paymenttaken = today;
      $scope.newuser.$up();
    };

    $scope.sendSMS = function(entity) {
      SendService.sendSMS(entity);
      titleService.setTitle( 'Clients' );
    };

});
