var local = require("./config/local");
var Sequelize = require('sequelize');
var sequelize = new Sequelize(
		local.model.mysql.database,
		local.model.mysql.account,
		local.model.mysql.password,
		local.model.mysql.options
	);

var Member = require('./models').Member;
var Post = require('./models').Post;
var Comment = require('./models').Comment;
var Education = require('./models').Education;
var Experience = require('./models').Experience;
var Contact = require('./models').Contact;

Member.sync({force:true});
Post.sync({force:true});
Comment.sync({force:true});
Education.sync({force:true});
Experience.sync({force:true});
Contact.sync({force:true});