/**
 * Module dependencies.
 */

var api = require('./routes/api');
var entries = require('./routes/entries');
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var register = require('./routes/register');
var messages = require('./lib/messages');
var login = require('./routes/login');
var user = require('./lib/middleware/user');
var validate = require('./lib/middleware/validate');
var page = require('./lib/middleware/page');
var Entry = require('./lib/entry');

var mysql = require('mysql');
var db = mysql.createConnection({
    host:     '127.0.0.1',
    user:     'root',
    password: '940327!',
    database: 'node_express_user'
});

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', api.auth);
app.use(user);
app.use(messages);
app.use(app.router);
app.use(routes.notfound);
app.use(routes.error);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/register', register.form);
app.post('/register', register.submit);
app.get('/login', login.form);
app.post('/login', login.submit);
app.get('/logout', login.logout);
app.get('/post', entries.form);
app.post(
   '/post',
   validate.required('entry[title]'),
   validate.lengthAbove('entry[title]', 4),
   entries.submit
);
app.get('/api/user/:id', api.user);
app.post('/api/entry', entries.submit);
app.get('/api/entries/:page?', page(Entry.count), api.entries);
app.get('/:page?', page(Entry.count, 1), entries.list);

if (process.env.ERROR_ROUTE) {
  app.get('/dev/error', function(req, res, next){
    var err = new Error('database connection failed');
    err.type = 'database';
    next(err);
  });
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

db.query(
    "CREATE TABLE IF NOT EXISTS user ("
    + "id INT(10) NOT NULL AUTO_INCREMENT, "
    + "name VARCHAR(100) NOT NULL, "
    + "pass VARCHAR(100) NOT NULL, "
    + "salt VARCHAR(100) NOT NULL, "
    + "PRIMARY KEY(id))",
    function(err) {
        if (err) throw err;
        console.log('create table user...');
    }
);

db.query(
    "CREATE TABLE IF NOT EXISTS article ("
    + "id INT(10) NOT NULL AUTO_INCREMENT, "
    + "username VARCHAR(100) NOT NULL, "
    + "title VARCHAR(100) NOT NULL, "
    + "body VARCHAR(500) NOT NULL, "
    + "PRIMARY KEY(id))",
    function(err) {
        if (err) throw err;
        console.log('create table article...');
    }
);
