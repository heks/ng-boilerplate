/**
 * Tests sit right alongside the file they are testing, which is more intuitive
 * and portable than separating `src` and `test` directories. Additionally, the
 * build process will exclude all `.spec.js` files from the build
 * automatically.
 */
describe( 'clients section', function() {
  beforeEach( function() { 
    module( 'ngBoilerplate.clients' );
    module( 'ngResource' );

  });

  it( 'should have a dummy test', inject( function() {
    expect( true ).toBeTruthy();
  }));
  /*
  it('listClientsController check for devices in the model', 
    inject(function(_$httpBackend_, $rootScope, $controller, Clients) {
        var scope = $rootScope.$new();
        var mockBackend = _$httpBackend_;
 
        mockBackend.expectGET('http://localhost:3000/clients').
          respond([{"firstname":"Alex",
         "lastname": "Aranda",
         "telephone":"7730001111",
         "carrier":"sprint",
         "plan":"45",
         "paymenttaken":"08/02/2001"}]);
 
        var ctrl = $controller('ClientsCtrl', {$scope: scope}, Clients);
 
        
        mockBackend.flush();  
 
        expect(scope.users.length).toEqual(1);
        expect(scope.users).toEqualData([{"firstname":"Alex",
         "lastname": "Aranda",
         "telephone":"7730001111",
         "carrier":"sprint",
         "plan":"45",
         "paymenttaken":"08/02/2001"}]);
  }));
 */

});

