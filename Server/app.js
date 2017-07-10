var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');
var cors = require('cors');

var port = process.env.NODEJS_PORT || 3000;
var ipaddr = process.env.NODEJS_IP || "127.0.0.1";
var app = express();

	var allowCrossDomain = function(req, res, next) {
	    res.header('Access-Control-Allow-Origin', '*');
	    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	    res.header('Access-Control-Allow-Headers', 'Content-Type');
	    res.header('Access-Control-Allow-Credentials', 'true');
	    next();
	}

	app.set('port', port);
	app.set('ipaddr', ipaddr);
	app.set('view options', { layout: false });
	app.use(cookieParser());
	app.use(bodyParser());
	app.use(cors());
	app.use(express.static(path.join(__dirname, './')));
	app.all('*', allowCrossDomain);

	require('./routes.js')(app);

app.listen(port);
console.log('Node listening on port %s', port);