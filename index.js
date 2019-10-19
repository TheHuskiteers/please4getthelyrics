var express = require('express');
var app = express();
var request = require('request');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

app.use(cookieParser());
app.use(bodyParser.json());

const port = 3000;
const env = process.env;

app.get('/', function(req, res) {
    console.log(req.cookies['token']);
    if (req.cookies['token']) {
	     res.sendFile('./spotify.html', {root: __dirname});
    } else {
	    res.redirect('/login');
    }
});

app.get('/:id', function(req, res) {

});

app.get('/login', function(req, res) {

    if (!req.cookies['token']) {
	res.redirect('https://accounts.spotify.com/authorize?' +
		     querystring.stringify({
			 client_id: env.SPOTIFY_CLIENT_ID,
			 response_type: 'code',
			 redirect_uri: env.REDIRECT_URI,
			 scope: 'streaming'}));
    }
});

app.get('/api/spotify_login/spotify_redirect', function(req, res) {
    var options = {
	url: 'https://accounts.spotify.com/api/token',
	form: {
	    grant_type: 'authorization_code',
	    code: req.query.code,
	    redirect_uri: env.REDIRECT_URI
	},
	headers: {
	    Authorization: 'Basic ' + Buffer.from(env.SPOTIFY_CLIENT_ID + ':' + env.SPOTIFY_CLIENT_SECRET).toString('base64')
	},
	json: true
    };
    request.post(options, function(err, response, body) {
	res.cookie('token', body.access_token, {expires_in: body.expires_in + Date.now()}).send('cookie set');
    });
    res.redirect('/');
});

app.listen(port, () => console.log('please4getthelyrics listening on port ' + port));
