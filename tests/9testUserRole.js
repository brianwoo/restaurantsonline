var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();

var mongoose = require("mongoose");
var config = require('../config');

// Connect to MongoDB through Mongoose
mongoose.connect(config.mongoUrl);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("Connected correctly to database server");
});

var UserRole = require('../models/userRole');

//chai.use(chaiHttp);


describe('Test UserRole', function() {

  it('insert', function(done) {
      
    var role1 = { roleDesc: "RestaurantMgr" };
    var role2 = { roleDesc: "Customer" };

    UserRole.create(role1, function (err, dish) {
        if (err) throw err;
        console.log('role1 created!' + dish);
    });
      
    UserRole.create(role2, function (err, dish) {
        if (err) throw err;
        console.log('role2 created!' + dish);
    });
      
    done();
  });    
    
    
    
  it('test get ALL UserRoles', function(done) {
      UserRole.find({})
        .exec(function(err, obj) {
          console.log(obj);
          done();
      })
  });     
    
/*    
  */  
    
});