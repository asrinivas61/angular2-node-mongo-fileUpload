var multer = require('multer');
var mongoDump = require('./xls_json.js');

module.exports = function (app) {
	
	var storage = multer.diskStorage({
	  destination: function (req, file, cb) {
	    cb(null, './uploads/')
	  },
	  filename: function (req, file, cb) {
	      cb(null, file.originalname);
	  }
	});
	var upload = multer({ storage: storage });

	app.post('/Wipro-EmpData/submit', upload.single('fileUpload'), function (req, res, next) {
		mongoDump(req.file.originalname);
		res.send('File uploaded successfully');
	});

	// /*----------  Accounts  ----------*/

	// app.get('/OBP-API-1.0/obp/v2.1.0/accounts', function(req, res, next) {
	// 	console.log('accounts session: ', req.session);
	// 	if(req.session.token) {
	// 		request.get({
	// 				headers: req.session.sessionHeaders,
	// 				url: 'http://'+remoteServerIP+':'+remoteServerPORT+'/OBP-API-1.0/obp/v2.1.0/accounts',
	// 			}, function(error, response, body){
	// 			  if(error) console.log('ERROR: while trying to fetch user accounts ', error);
	// 			  return res.send(JSON.parse(body));
	// 		});
	// 	} else {
	// 		console.log('token undefined, Unauthenticated Access');
	// 		res.redirect('/login');
	// 	}
	// });
};