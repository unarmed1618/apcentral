// web.js -- Filename 
// This section necessary to declare plugins/extensions

var jquery = require("jquery");
var express = require("express");
var logfmt = require("logfmt");
var fs = require("fs");
var jade = require("jade");
var jadeOptions = { filename: './', pretty: true };

var url = require("url");

var app = express();
app.use(express.favicon("favicon.ico"));
//settable application attribute variables

app.locals({
	title: "Darrow's portfolio application"
    });
var personalInfo,contactInfo, portfolioData, earlyProjectData, recentProjectData;

//Read in the datafiles
fs.readFile("contactInfo.json","utf8",function(err,data) {
	if(err) throw err;
	contactInfo = JSON.parse(data);
    });
fs.readFile("personalInfo.json","utf8",function(err,data) {
	if(err) throw err;
	personalInfo = JSON.parse(data);
    });
fs.readFile("portfolioData.json","utf8", function (err, data) {
	if(err) throw err;
	portfolioData = JSON.parse(data);

    }); 
fs.readFile("earlyProjectData.json","utf8", function (err, data) {
        if(err) throw err;
	earlyProjectData =JSON.parse(data);

    });
fs.readFile("recentProjectData.json","utf8", function (err, data) {
        if(err) throw err;
	recentProjectData =JSON.parse(data);

    });
app.use(logfmt.requestLogger()); //logfmt hook

//Routing happens from here down
//app.post('/login',passport.authenticate('local', {successRedirect: '/', failureRedirect: '/login'}));

//app.get('/login')

app.get('/bootstrap.css', function(req,res) {
	res.writeHead(200, {"Content-Type": "text/css"});
	fs.readFile('./css/bootstrap.css' , 'utf8', function(err, fd) {
		res.end(fd);
	    });
    });
app.get('/academicTranscript', function(req,res) {
	res.writeHead(200, {"Content-Type": "application/pdf"});
	fs.readFile('./at.pdf', function(err, fd) {
		res.end(fd);
	    });
    });
app.get('/adaptPaper', function(req,res) {
	res.writeHead(200, {"Content-Type": "application/pdf"});
	fs.readFile('./adaptiveEEG.pdf', function(err,fd) {
		res.end(fd);
	    });
    });
app.get('/resume', function(req,res) {
	res.writeHead(200, {"Content-Type": "application/pdf"});
	fs.readFile('./resume.pdf',function(err,fd) {
		res.end(fd);
	    });
    });
app.get('/bootstrap.css.map',function(req,res) {
	res.send(fs.readFileSync('css/bootstrap.css.map').toString());
    });
app.get('/contactme', function(req,res) {
	res.send(jcn(contactInfo));	
    });
app.get('/personalinfo', function(req,res){
	res.send(jpers(personalInfo));
    });
app.get('/bootstrap.js',function(req,res){
	res.writeHead(200, {"Content-Type": "text/javascript"});
	fs.readFile('js/bootstrap.js', 'utf8', function(err, fd) {
                res.end(fd);
            });
    });

//Login info for ManagementConsole

//Respond to :id with userid's :element
/*
app.get('/:id/', function(req,res) {
var data = db.get(:id.splash);

res.send(jsp(data));
});

app.get('/:id/:element' function(req,res) {
var data = db.get(:id.:element);
res.send(jsp(data));
});
app.get('/mgt/:id', function(req,res) {


});
 */

app.get('/', function(req, res) {
	res.send(jsp(portfolioData));
    });
app.get('/recentProjects', function(req,res) {
	res.send(jsp(recentProjectData));
    });
app.get('/earlyProjects', function(req,res) {
	res.send(jsp(earlyProjectData));
    });
// Don't mess with this stuff
var port = process.env.PORT || 5000;
app.listen(port, function() {
	console.log("Listening on " + port);
    });

