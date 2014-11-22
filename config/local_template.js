var sslEnabled = false;
var path  = require('path');

module.exports = {
	
	enviroment: "development",

	port : (process.env.PORT || 3000),

	middleware: {
		view_cache : false,
		logger_dev : true,
		less      : false
	}, 

	model: {
		mysql : {
			database: "database",
			account : "admin",
			password: "password",
			options : {
				host    : "sdm2.im.ntu.edu.tw",
				logging : false
			}
		},
		mongo : {
			database: "SDM",
			options : {
				host: "127.0.0.1"
			}
		}
	},

	session: {
		redis: {
			host: 'localhost',
			port: 6379
		}
    }

}
