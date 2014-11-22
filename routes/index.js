
/*
 * GET home page.
 */

exports.index = function(req, res){
	var config = {};
	// console.log(req.session)
	config.isLogin = req.session.isLogin ? true : false;
		if(config.isLogin)
			config.User = req.session.user;
		else
			config.User = false;
  	res.render('index', config);
};

exports.partial = function (req, res) {
	var name = req.params.name;
	res.render('partials/' + name);
};