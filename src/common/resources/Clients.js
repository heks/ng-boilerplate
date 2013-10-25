angular.module('Resources',['ngResource'])

.factory('Clients', function($resource) {
  return $resource("/clients/:id", {id:'@_id'},
   {
   'query' :{method: 'GET',isArray:true}, // Cache = true does not update clients unless refreshed
   'up': {method:'PUT',params:{id:'@_id'}, headers: {'Content-Type': 'application/json'}},
   'remove':{method: 'DELETE', params:{id:'@_id'}, headers: {'Content-Type': 'application/json'}}
   });
})
.factory('Invoices', function($resource) {
  return $resource("/invoice/:id", {id:'@_id'},
   {
   'query' :{method: 'GET',isArray:true}, // Cache = true does not update clients unless refreshed
   'up': {method:'PUT',params:{id:'@_id'}, headers: {'Content-Type': 'application/json'}},
   'remove':{method: 'DELETE', params:{id:'@_id'}, headers: {'Content-Type': 'application/json'}}
   });
});