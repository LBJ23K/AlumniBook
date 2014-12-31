
/*
 * GET home page.
 */
var Notification = require('../models').Notification;
var _ = require('underscore');

exports.index = function(req, res){
	var config = {};
	// console.log(req.session)
	config.isLogin = req.session.isLogin ? true : false;
		if(config.isLogin){
			Notification.findAll({
				where: {
					member_id: req.session.user.member_id,
					read: "unread"
				}
			}).success(function( notifications ){
				config.Notifications =  _.size(notifications);
				// console.log("notifications: ="+config.Notifications);
				config.User = req.session.user;
				res.render('index', config);
			});
			
		}
		else
			config.User = false;
  	
};

exports.partial = function (req, res) {
	var name = req.params.name;
	res.render('partials/' + name);
};