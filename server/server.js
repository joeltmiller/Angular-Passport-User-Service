var express = require('express');
var passport = require('passport');
var session = require('express-session');
var pg = require('pg');
var bodyParser = require('body-parser');

var index = require('./routes/index');

var localStrategy = require('passport-local').Strategy;

var app = express();

var connectionString = 'postgres://localhost:5432/passport_today';

app.use(express.static('server/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//[][][][][][][][][][][][][][][][][][][][][][][][][][]
//                  PASSPORT THINGS
//[][][][][][][][][][][][][][][][][][][][][][][][][][]

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: false,
	cookie: {maxAge: 60000, secure: false}
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);

passport.serializeUser(function(user, done){
	console.log('serializeUser', user);
	done(null, user.id);
});

passport.deserializeUser(function(id, done){
	console.log('deserializeUser', id);
	pg.connect(connectionString, function(err, client){
		var user = {};

		var query = client.query('SELECT * FROM users WHERE id = $1', [id]);

		query.on('row', function(row){
			user = row;
			console.log('User object', user);
			done(null, user); //creates req.user
		});
	});
});

passport.use('local', new localStrategy({
	passReqToCallback: true,
	usernameField: 'username'
}, function(req, username, password, done){

	pg.connect(connectionString, function(err, client){
		var user = {};

		var query = client.query('SELECT * FROM users WHERE username = $1', [username]);

		query.on('row', function(row){
			user = row;
			console.log('User object', user);
		});

		query.on('end', function(){
			if(user && user.password === password){
				console.log('success');
				done(null, user); //success
			} else {
				done(null, false); //fail
			}
			client.end();
		});
	});

	//does the password match?

}));


var server = app.listen(3000, function(){
	var port = server.address().port;
	console.log('Address', server.address());
	console.log('Listening on port', port);
});