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
var Like = require("./like").Like(Sequelize,sequelize);

var User = require("./user").User(Sequelize,sequelize);
var Education = require("./education").Education(Sequelize,sequelize);
var Contact = require("./contact").Contact(Sequelize,sequelize);
var Experience = require("./experience").Experience(Sequelize,sequelize);

Member.hasOne(Education, {foreignKey: 'member_id'})
Education.belongsTo(Member, {foreignKey: 'member_id'})

Member.hasOne(Contact, {foreignKey: 'member_id'})
Contact.belongsTo(Member, {foreignKey: 'member_id'})

Member.hasOne(Experience, {foreignKey: 'member_id'})
Experience.belongsTo(Member, {foreignKey: 'member_id'})

Member.hasMany(Post, {foreignKey: 'member_id'})
Post.belongsTo(Member, {foreignKey: 'member_id'})

Member.hasMany(Issue, {foreignKey: 'member_id'})
Issue.belongsTo(Member, {foreignKey: 'member_id'})

Member.hasMany(Issue, {foreignKey: 'member_id'})
Issue.belongsTo(Member, {foreignKey: 'member_id'})

Issue.hasMany(Comment, {foreignKey: 'issue_id'});
Comment.belongsTo(Issue, {foreignKey:'issue_id'});

Member.hasMany(Comment, {foreignKey:'member_id'});
Comment.belongsTo(Member, {foreignKey:'member_id'});


Issue.hasMany(Like, {foreignKey: 'issue_id'});
Like.belongsTo(Issue, {foreignKey:'issue_id'});

Member.hasMany(Like, {foreignKey:'member_id'});
Like.belongsTo(Member, {foreignKey:'member_id'});

exports.Member = Member;

exports.Post = Post;
exports.Comment = Comment;
exports.User = User;
exports.Education = Education;
exports.Contact = Contact;
exports.Experience = Experience;

exports.Comment = Comment;
exports.Issue = Issue;
exports.Like = Like;
