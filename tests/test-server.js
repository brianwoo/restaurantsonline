var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();

chai.use(chaiHttp);


describe('Blobs', function() {
  it('should list ALL blobs on /blobs GET', function(done) {
  chai.request("http://www.google.ca")
    .get('')
    .end(function(err, res){
      res.should.have.status(200);
      done();
    });
}); 
    
    
    
    
  it('should list a SINGLE blob on /blob/<id> GET');
  it('should add a SINGLE blob on /blobs POST');
  it('should update a SINGLE blob on /blob/<id> PUT');
  it('should delete a SINGLE blob on /blob/<id> DELETE');
});