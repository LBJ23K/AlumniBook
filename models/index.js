var local = require("../config/local");
var Sequelize = require('sequelize');
var sequelize = new Sequelize(
		local.model.mysql.database,
		local.model.mysql.account,
		local.model.mysql.password,
		local.model.mysql.options
	);

var Member = require("./member").Member(Sequelize,sequelize);
var Post = require("./post").Post(Sequelize,sequelize);
var Comment = require("./comment").Comment(Sequelize,sequelize);
var Issue = require("./issue").Issue(Sequelize,sequelize);

Member.hasMany(Post, {foreignKey: 'member_id'})
Post.belongsTo(Member, {foreignKey: 'member_id'})

Member.hasMany(Issue, {foreignKey: 'member_id'})
Issue.belongsTo(Member, {foreignKey: 'member_id'})

Post.hasMany(Comment, {foreignKey: 'post_id'});
Comment.belongsTo(Post, {foreignKey:'post_id'});

Member.hasMany(Comment, {foreignKey:'member_id'});
Comment.belongsTo(Member, {foreignKey:'member_id'});

exports.Member = Member;
exports.Post = Post;
exports.Comment = Comment;
exports.Issue = Issue;