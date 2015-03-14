var models = require("./models");
var express = require("express");
var app = express();
var mongoose = require("mongoose");
var mongoStore = require("connect-mongodb");
var passive = require("./passive");
var LoginToken, User,db;
models.defineModels(mongoose, function() {
  app.User = User = mongoose.model('User');
  app.LoginToken = LoginToken = mongoose.model('LoginToken');
  db = mongoose.connect(app.set('db-uri'));

})
module.exports = function loadUserPassive(req,res,next) {
//console.log("Entered passiveLoad");
    if (req&&req.session&&req.session.user_id) {
        //console.log("Entered If");
        User.findOne({_id:req.session.user_id}, function(err,user) {
            if (user) {
               // console.log("Found User");
                req.currentUser = user;
                next();
            }  else {
                //console.log("User not Found");
                next();
                }
});
} else {
    //console.log("No user logged in");
    next();
}
}
