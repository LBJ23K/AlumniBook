var models  = require('../models');
var _ = require('underscore');
var async = require('async');
var Member = require('../models').Member;
var Issue = require('../models').Issue;
var Comment = require('../models').Comment;
var Like = require('../models').Like;

exports.create = function(req, res){
  console.log(req.body);
  models.Issue.sync().success(function() {
    // here comes your find command.
      models.Issue
      .build({title:req.body.title, member_id:req.session.user.member_id, content:req.body.content, parent_issue:req.body.parent_issue})
      .save()
      .success(function(anotherTask) {
        // you can now access the currently saved task with the variable anotherTask... nice!
        console.log('Created an issue');
        //res.send("respond with a resource");
        res.json(anotherTask);
      }).error(function(error) {
        // Ooops, do some error-handling
        console.log(error);
      })
  })
};

exports.list = function(req, res){
  models.Issue.sync().success(function() {
    // here comes your find command.
      models.Issue
      .findAll({include: [ models.Member, Comment ],order: [['createdAt', 'DESC']]}).success(function(result){
        console.log('retrieve success');
        res.json(result);
      })
  })
};


exports.listById = function(req, res){
  // console.log(req.param('issue_id'));
  // models.Issue.sync().success(function() {
  //     models.Issue
  //     .find({where: {issue_id: req.param('issue_id')},include: [ models.Member ], order: [['createdAt', 'DESC']] }).success(function(result){
  //       console.log('retrieve success');
  //       res.json(result);
  //     })   
  // }).error(function(error) {
  //       // Ooops, do some error-handling
  //       console.log(error);
  //       res.json(error);
  //     })
  Issue.find({ where: {issue_id:req.param('issue_id')}, include: [Member]}).success(function(post){
    console.log(post)
    if(post.Member != null)
      post.Member.password = "";
    async.parallel([
      function(callback){
        if(req.session.user){
          Like.findAll({where:{issue_id:req.param('issue_id'), member_id:req.session.user.member_id}}).success(function(likes){
            console.log(likes)
            if(likes.length != 0)
              callback(null, 1)
            else
              callback(null, 0)
          })
        }else{
          callback(null, 0)
        }
      },
      function(callback){
        Like.findAll({where:{issue_id:req.param('issue_id')}}).success(function(likes){
          console.log(likes)
          if(likes.length != 0)
            callback(null, likes.length)
          else
            callback(null, 0)
        })
      },
      function(callback){
        Comment.findAll({where:{issue_id:req.param('issue_id')}, include:[Member]}).success(function(comments){
          comments = _.each(comments, function(comment){
          if(comment.Member != null )
            comment.Member.password = "";
          });
          console.log(comments)
          callback(null, [])
          
        })
      }],function(err, result){
        // console.log(result)
        var isAuthor
        if(req.session.user)
          isAuthor = (req.session.user.member_id==post.member_id);
        else
          isAuthor = 0;

        res.json({post:post, likeThis:result[0], like:result[1],comments:result[2], isAuthor:isAuthor});
      })
    
  });
};

exports.destroy = function(req, res){
  console.log(req.param('issue_id'));
  models.Issue.sync().success(function() {
      models.Issue
      .find({where: {issue_id: req.param('issue_id')}}).success(function(result){
        console.log('retrieve success');
        result.destroy().success(function() {
            res.json({success: 'yes'});
          }).error(function(error) {
        // Ooops, do some error-handling
        console.log(error);
        res.json({success: 'no'});
      })
      }).error(function(error) {
        // Ooops, do some error-handling
        console.log(error);
        res.json({success: 'no'});
      })   
  })
};

exports.update = function(req, res){
  console.log(req.body.issue_id);
  models.Issue.sync().success(function() {
      models.Issue
      .find({where: {issue_id: req.body.issue_id}}).success(function(result){
        console.log('retrieve success');
        result.updateAttributes({title:req.body.title, content:req.body.content, parent_issue:req.body.parent_issue}).success(function(updatedResult) {
            res.json(updatedResult);
          }).error(function(error) {
        // Ooops, do some error-handling
        console.log(error);
        res.json(error);
      })
      }).error(function(error) {
        // Ooops, do some error-handling
        console.log(error);
        res.json(error);
      })   
  })
};