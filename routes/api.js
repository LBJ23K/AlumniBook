/*
 * Serve JSON to our AngularJS client
 */
var Member = require('../models').Member;
var Post = require('../models').Post;
var Issue = require('../models').Issue;
var Comment = require('../models').Comment;
var md5 = require('MD5');
var Education = require('../models').Education;
var Experience = require('../models').Experience;
var Contact = require('../models').Contact;
var Like = require('../models').Like;
var Notify = require('./notify');
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


exports.local_Login = function(req, res){
	var account = req.params.account;
	Member.findOne({where:{account:account}}).success(function(member){
		var user = _.omit(member.dataValues, 'password', 'createdAt', 'updatedAt');
			req.session.user = user;
			req.session.isLogin = true;
			res.redirect('/' );
		
	});
	
}
exports.likePost = function(req, res){
	Like.create({issue_id:req.params.id, member_id:req.session.user.member_id})
	.success(function(like){
		res.json({msg:"success"});	
	})
	
}
exports.dislikePost = function(req, res){
	Like.findAll({where:{issue_id:req.params.id, member_id:req.session.user.member_id}})
	.success(function(like){
		console.log(like[0])
		like[0].destroy();
		res.json({msg:"success"})
	});
		
}
exports.modifyaccount = function (req, res){
	// console.log(req.body);
	// req.body.password = md5(req.body.password);
	// Member.create(req.body).success(function(member){
	// 	Education.create({member_id:member.dataValues.member_id})
	// 	Experience.create({member_id:member.dataValues.member_id})
	// 	Contact.create({member_id:member.dataValues.member_id})
	// 	res.json({msg:"success"});
	// })
	// .error(function(err){
	// 	console.log(err);
	// })
	console.log(req.session.user.member_id)
	Member.find({where:{member_id:req.session.user.member_id}}).success(function(member){
		console.log(req.session.user.member_id, member.member_id)
		if(member){
			console.log(member)
			member.updateAttributes({name:req.body.name, 
									 gender:req.body.gender,
									 school:req.body.school, 
									 department:req.body.department,
									 grade:req.body.grade,
									 photo:req.body.photo}).success(function(change){
				// console.log(change)
				req.session.user = change.dataValues;
				// console.log(change.dataValues)
				// console.log(req.session.user)
				res.json({msg:"success"});
			})
			
		}
	})

}
exports.getaccount = function(req,res){
	var id = req.session.user.member_id;
	console.log(req.session.user);
    Member.find({
        where: {
            member_id: id
        }
    }).success(function(member) {
    	var user = _.omit(member.dataValues, 'password', 'createdAt', 'updatedAt');
        res.json(user);
    })
}
exports.login = function (req, res){
	// var account = req.body.account.replace(/(<([^>]+)>)/ig,"");
	var query = {
		where:{
			account: req.body.account
		}
	}
	Member.find(query).success(function(member){
		// console.log(JSON.stringify(member));
		// if(member == null){
		// 	// res.end("fail");
		// 	res.json({msg:"No user!"});
		// }
		// else if(md5(req.body.password) == member.dataValues.password){
		// 	var user = _.omit(member.dataValues, 'password', 'createdAt', 'updatedAt');
		// 	console.log(user);
		// 	req.session.user = user;
		// 	req.session.isLogin = true;
		// 	res.json({msg:"success"});
		// }
		// else{
		// 	res.json({msg:"Wrong password"});
		// }
		if(member == null){
			res.end("fail");
			res.json({msg:"No user!"});
		}
		else{
			var user = _.omit(member.dataValues, 'password', 'createdAt', 'updatedAt');
			req.session.user = user;
			req.session.isLogin = true;
			res.json({msg:"success"});
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
		async.parallel([
			function(callback){
				Like.findAll({where:{post_id:req.params.id, member_id:req.session.user.member_id}}).success(function(likes){
					console.log(likes)
					if(likes.length != 0)
						callback(null, 1)
					else
						callback(null, 0)
				})
			},
			function(callback){
				Like.findAll({where:{post_id:req.params.id}}).success(function(likes){
					console.log(likes)
					if(likes.length != 0)
						callback(null, likes.length)
					else
						callback(null, 0)
				})
			},
			function(callback){
				Comment.findAll({where:{post_id:req.params.id}, include:[Member]}).success(function(comments){
					comments = _.each(comments, function(comment){
					if(comment.Member != null	)
						comment.Member.password = "";
					});
					console.log(comments)
					callback(null, comments)
					
				})
			}],function(err, result){
				// console.log(result)
				res.json({post:post, likeThis:result[0], like:result[1],comments:result[2]});
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
		issue_id:req.body.post_id,
		member_id:req.session.user.member_id,
		content:req.body.content
	}
	Comment.create(comment).success(function(theCommnet){
		console.log(theCommnet.dataValues);
		Notify.notify(comment, "comment", req.session.user.member_id);
		res.json({msg:"success"});
		//send mail to subscribers
	})

}

exports.checkLogin = function(req, res, next){
	var isLogin = false;
	if( _.has(req.session, 'isLogin') ){
		isLogin = req.session.isLogin;
	}
	if(isLogin){
		next();
	}else{
		res.status(401).json({error:true,msg:"請登入"});
	}
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

