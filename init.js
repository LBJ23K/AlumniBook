var local = require("./config/local");
var Sequelize = require('sequelize');
var sequelize = new Sequelize(
		local.model.mysql.database,
		local.model.mysql.account,
		local.model.mysql.password,
		local.model.mysql.options
	);

var Member = require('./models').Member;
var Comment = require('./models').Comment;
var Like = require('./models').Like;
var Issue = require('./models').Issue;

Member.sync({force:true});
Comment.sync({force:true});
Like.sync({force:true});
Issue.sync({force:true});