//Empty commit
module.exports = function(app){
app.get('/signup', function(req,res){
    res.render('signupForm.jade');
});
app.post('/signup',function(req,res){
    var u = new User(req.body.user);
    u.save();
    res.redirect('/signup');
});
app.get('/login', function(req,res){
    res.render('login.jade');
});
app.post('/login', function(req, res) {
  User.findOne({ email: req.body.user.email }, function(err, user) {
    if (user && user.authenticate(req.body.user.password)) {
      req.session.user_id = user.id;
      if (true) {
        var loginToken = new LoginToken({ email: user.email });
        loginToken.save(function() {
          res.cookie('logintoken', loginToken.cookieValue, { expires: new Date(Date.now() + 2 * 604800000), path: '/console/'+user.shortname });
          res.redirect('/console/'+user.shortname);
        });
      } else {//no remember                      
        res.redirect('/console/'+user.shortname);
      }
    } else {
      req.flash('error', 'Incorrect credentials');
      res.redirect('/login');
    }
  });
});
app.get('/logout', function(req,res){
req.session.currentUser= null;
});

/* Implement this -- */
app.get('/recognize', loadUserPassive, function(req,res){
if(req.currentUser) {
res.send("Hello, <a href='/console/"+req.currentUser.shortname +"'>"+ req.currentUser.first_name +".");
} else {
res.send("<a href='/login'>Login</a> or <a href='/signup'>Sign up</a>");
}
});
}
