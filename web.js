// web.js -- Filename 
// This section necessary to declare plugins/extensions
var jquery = require("jquery");
var flash = require("connect-flash");
var express = require("express");
var logfmt = require("logfmt");
var fs = require("fs");
var forms = require("forms");
var models = require("./models");
var mongoose = require("mongoose");
var mongoStore = require("connect-mongodb");
var jade = require("jade");
var url = require("url");
var jadeOptions = { filename: './', pretty: true };
var Page, Entry, LoginToken, User,db;
var app = express();

function renderJadeFile(template, options) {
  var fn = jade.compile(template, options);
  return fn(options.locals);
}
 var dbstr = "mongodb://human:hurpen@ds039860.mongolab.com:39860/heroku_app21751565"
app.configure('development', function() {
  app.set('db-uri', dbstr);
  app.use(express.errorHandler({ dumpExceptions: true }));
  app.set('view options', {
    pretty: true
  });
});

app.configure('test', function() {
  app.set('db-uri', dbstr);
  app.set('view options', {
    pretty: true
  });
});

app.configure('production', function() {
  app.set('db-uri', dbstr);
});

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.use(express.cookieParser());
  app.use(express.session({ store: mongoStore(app.set('db-uri')), secret: 'topsecret' }));
  app.use(flash());
  app.use(express.bodyParser());
  app.use(express.static(__dirname + '/public'));
});
//settable application attribute variables
models.defineModels(mongoose, function() {
  app.Entry = Entry = mongoose.model('Entry');
  app.Page = Page = mongoose.model('Page');
  app.User = User = mongoose.model('User');
  app.LoginToken = LoginToken = mongoose.model('LoginToken');
  db = mongoose.connect(app.set('db-uri'));

})

//var logins = require('./login')(app);
app.locals({
	title: "Darrow's portfolio application"
    });

//Read in the datafiles
app.use(logfmt.requestLogger()); //logfmt hook


  app.use('/recognize', function loadUserPassive(req,res,next) {
    if (req&&req.session&&req.session.user_id) {
        User.findOne({_id:req.session.user_id}, function(err,user) {
            if (user) {
                req.currentUser = user;
                next();
            }  else {
                next();
                }
});
} else {
    next();
}
});
app.get('/signup', function(req,res){
    res.render('signupForm.jade');
});
app.post('/signup',function(req,res){
    var u = new User(req.body.user);
    u.save();
    res.redirect('/signup');
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
res.redirect("/");
});
//currently in use
function authentify(req,res,next){
	if (req&&req.session&&req.session.user_id) {
        User.findOne({_id:req.session.user_id}, function(err,user) {
            if (user) {
                req.currentUser = user;
                next();
            }  else {
                //next();
		res.redirect('/'+req.params.userId);
                }
});
} else {
    res.redirect('/'+req.params.userId);
}
}
//Not currently in use
function authenticate(req,res,next) {
	if(req.currentUser&&(req.currentUser.shortname == req.params.userId))
	{
		next();
	}
	else
	{
		res.redirect('/'+req.params.userId);
	}
}

app.get('/recognize', function(req,res){
if(req.currentUser) {
res.send("Hello, <a href='/console/"+req.currentUser.shortname +"'>"+ req.currentUser.first_name +".");
} else {res.render("login.jade");}
});

app.get('/console/:userId',authentify, function(req,res){
if(req.currentUser) {
    User.findOne({'shortname':req.params.userId},function(err,user){
	res.render('console.jade',{'user':user});
});
}
else
res.redirect('/:userId');
});
app.get('/scan', function(req,res){
res.render('scanner.jade');
});

//Add authentication for is this user the userId
app.get('/:userId/new', authentify,function(req,res){
res.render('entryForm.jade',{'user':req.params.userId,'method':"create"});
//Return a form that creates a new entry for this user
});
app.get('/:userId/edit',authentify,function(req,res){
	Page.findOne({'shortname':req.params.userId,'path':'/'},function(err,page) {
        res.render('entryForm.jade',{'user':req.params.userId,'method':"update",'path':req.params.path,'page': page});
    });
});
app.get('/:userId/',  function(req,res){
    Page.findOne({'shortname':req.params.userId,'path':'/'},function(err,page) {
        res.render('splash.jade',{'page':page});
    });
});

app.get('/:userId/:path', function(req,res){
    Page.findOne({'shortname':req.params.userId,'path':req.params.path},function(err,page) {
	console.log(page);
        res.render('splash.jade',{'page':page});
    });
});

//Add auth
app.get('/:userId/:path/edit', authentify,function(req,res){
    Page.findOne({'shortname':req.params.userId,'path':req.params.path},function(err,page) {
        res.render('entryForm.jade',{'user':req.params.userId,'method':"update",'path':req.params.path,'page': page});
    });
});
//add auth
app.post('/:userId/create', authentify, function(req,res){
var e = new Page(req.body.page);
e.shortname = req.params.userId;
e.save();
res.redirect('/'+req.params.userId+'/'+e.path);
});

app.post('/:userId/update', authentify, function(req,res){
Page.update({'shortname':req.params.userId,'path':req.body.path},req.body.page,function(err, page,lastErrorObject) {
res.redirect('/'+req.params.userId+'/'+page.path);
});
});
app.post('/:userId/:path/delete', authentify, function(req,res){
Page.findOne({'shortname':req.params.userId,'path':req.body.path},function(err,page) {
page.remove;
});
});
app.get('/:userId',function(req,res){
	Page.findOne({'shortname':req.params.userId,'path':'/'},function(err,page) {
		res.render('splash.jade',{'page':page});
	});
});


// Don't mess with this stuff
var port = process.env.PORT || 5000;
app.listen(port, function() {
	console.log("Listening on " + port);
    });

