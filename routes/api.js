/*
 * Serve JSON to our AngularJS client
 */
var Member = require('../models').Member;
var Post = require('../models').Post;
var Comment = require('../models').Comment;
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
// var passport = require('passport')
// var FacebookStrategy = require('passport-facebook').Strategy;
// var facebookAuth = require("../config/facebook_auth");

exports.name = function (req, res) {
  res.json({
  	name: 'Bob'
  });
};

exports.createMember = function (req, res){
	console.log(req.body);
	Member.create(req.body).success(function(member){
		// console.log(member.name);
		res.json({msg:"success"});
	})
	.error(function(err){
		console.log(err);
	})
}

exports.login = function (req, res){
	var query = {
		where:{
			account: req.body.account
		}
	}
	Member.find(query).success(function(member){
		// console.log(member.dataValues)
		if(req.body.password == member.dataValues.password){
			var user = _.omit(member.dataValues, 'password', 'createdAt', 'updatedAt');
			console.log(user)
			req.session.user = user;
			req.session.isLogin = true;
			res.json({msg:"success"});
		}
		else{
			res.json({msg:"fail"});
		}
		
	});
}
exports.showPosts = function(req, res){
	// sequelize
	// .query('SELECT * FROM post left join on post.member_id = member.id', Post, Member)
	// .success(function(posts){
	// // Each record will now be mapped to the project's DAO-Factory.
	// console.log(posts)
	// res.json(posts)
	// })
	Post.findAll({ where: {}, include: [Member, Comment]}).success(function(posts){
		posts = _.each(posts, function(post){
			if(post.Member != null	)
				post.Member.password = "";
		})
		res.json(posts);
	});



	
}
exports.showPost = function(req, res){
	console.log(req.params);
	Post.find({ where: {post_id:req.params.id}, include: [Member]}).success(function(post){
		if(post.Member != null)
			post.Member.password = "";
		Comment.findAll({where:{post_id:req.params.id}, include:[Member]}).success(function(comments){
			comments = _.each(comments, function(comment){
			if(comment.Member != null	)
				comment.Member.password = "";
			});
			res.json({post:post, comments:comments});
		})
	});



	
}
exports.submitPost = function(req, res){

	var post = {
		member_id:req.session.user.member_id,
		title: req.body.title,
		content: req.body.content
	}
	Post.create(post).success(function(post){
		console.log(post.dataValues);
		res.json({msg:"success", post_id:post.dataValues.post_id});
	})
	.error(function(err){
		console.log(err);
	})
}
exports.commentOn = function(req, res){
	var comment = {
		post_id:req.body.post_id,
		member_id:req.session.user.member_id,
		content:req.body.content
	}
	Comment.create(comment).success(function(theCommnet){
		console.log(theCommnet.dataValues);
		res.json({msg:"success"})
	})

}

// exports.facebookAuth = function(req,res){
// 	passport.use(new FacebookStrategy({
//     clientID: facebookAuth.appId,
//     clientSecret: facebookAuth.appSecret,
//     callbackURL: "http://www.example.com/auth/facebook/callback"
//   },
//   function(accessToken, refreshToken, profile, done) {
//   	res.send('ok');
//     // User.findOrCreate(..., function(err, user) {
//     //   if (err) { return done(err); }
//     //   done(null, user);
//     // });
//   }
// ));
// }

