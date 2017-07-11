var multer = require('multer');
var dbOper = require('./dbOperation.js');

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

	/*----------  File Upload  ----------*/

	app.post('/Wipro-EmpData/submit', upload.single('fileUpload'), function (req, res, next) {
		let opp = dbOper.mongoDump(req.file.originalname, (err, result) => {
			if(err) {
				res.send(err);
				return;
			}
			res.send('File uploaded successfully');
		});
	});

	/*----------  EMP details fetch  ----------*/

	app.get('/Wipro-EmpData/:id', function(req, res, next) {
		dbOper.mongoFind(req.params.id)
				.then((resp) => {
					res.send(resp);
				});
	});
};