var Member = require('../models').Member;
var Issue = require('../models').Issue;
var Comment = require('../models').Comment;
var Notify_issue = require('../models').Notify_issue;
var Notification = require('../models').Notification;
var _ = require('underscore');
var async = require('async');
var local = require("../config/local");
var Sequelize = require('sequelize');
var sequelize = new Sequelize(
		local.model.mysql.database,
		local.model.mysql.account,
		local.model.mysql.password,
		local.model.mysql.options
	);


exports.subscribe = function(req, res){
	Notify_issue.create({
		issue_id:req.params.id, 
		member_id:req.session.user.member_id
	}).success(function(){
		res.json({msg:"subscirbe success"});
		console.log("subscirbe success");	
	});
}

exports.unsubscribe = function(req, res){
	Notify_issue.findAll({
		where:{
			issue_id:req.params.id, 
			member_id:req.session.user.member_id
		}
	}).success(function(unsubscribe){
		// console.log(unsubscribe);
		unsubscribe.forEach(function(unsubscribe){
			unsubscribe.destroy();
		});
		res.json({
			msg:"unsubscribe success"
		});
	});
}

exports.notify = function(req, res){
	
	//send mail to all subscribers
	Notify_issue.findAll({
        where: {
             issue_id: req.params.id
        },
    }).success(function(notify_issues) {
        // console.log(notify_issue);
        //find all user
        notify_issues.forEach(function(issue){
        	Notification.create({
				issue_id: issue.issue_id, 
				member_id: issue.member_id,
				type: req.params.type,
				read: "unread"
			}).success(function(){
				res.json({
					msg:"notify success"
				});
				console.log("notify success");	
			});
        });
    });
}
