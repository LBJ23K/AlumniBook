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
			database: "your_database",
			account : "account",
			password: "password",
			options : {
				host    : "localhost",
				logging : false
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
