var models  = require('../models');
var _ = require('underscore');
var async = require('async');
var Member = require('../models').Member;
var Issue = require('../models').Issue;
var Comment = require('../models').Comment;
var Like = require('../models').Like;
var PostCategory = require('../models').PostCategory;
var sanitizer = require('sanitizer');
var Notify_issue = require("../models").Notify_issue;
var Notification = require('../models').Notification;

exports.create = function(req, res){
  console.log(req.body);
  // var title = sanitizer.sanitize(req.body.title);
  // var content = sanitizer.sanitize(req.body.content);
  models.Issue.sync().success(function() {
    // here comes your find command.
      models.Issue
      .build({title:req.body.title, member_id:req.session.user.member_id, content:req.body.content, parent_issue:req.body.parent_issue, postCategory_id: req.body.postCategory_id})
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
      .findAll({include: [ models.Member, Comment, PostCategory ],order: [['createdAt', 'DESC']]}).success(function(result){
        console.log(result.dataValues);
        _.each(result, function(oneResult){
          var temp = _.omit(oneResult.Member.dataValues, 'password');
           oneResult.Member.dataValues = temp;
           temp = _.omit(oneResult.Member.dataValues, 'member_id');
           oneResult.Member.dataValues = temp;
           temp = _.omit(oneResult.Member.dataValues, 'account');
           oneResult.Member.dataValues = temp;
           //console.log(oneResult.dataValues + '\n\n');
        });
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
  Issue.find({ where: {issue_id:req.param('issue_id')}, include: [Member, PostCategory]}).success(function(post){
    console.log(req.session.user)
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
          // console.log(likes)
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
          callback(null, comments)
          
        })
      },
      function(callback){
        if(req.session.user){
            Notify_issue.findAll({
              where:{
                issue_id:req.param('issue_id'), 
                member_id:req.session.user.member_id 
              }
            }).success(function(subscribe){
              if(subscribe.length == 0){
                callback(null, false)
              }
              else{
                callback(null, true)
              }
            })
        }
        else{
          callback(null, false)
        }
      },function(callback){
          if(req.session.user){
              Notification.findAll({
                  where: {
                      member_id: req.session.user.member_id,
                      issue_id: req.param('issue_id'),
                      read: "unread"
                  }
              }).success(function(unread){
                  if(_.size(unread) != 0){
                      _.map(unread, function(unread){
                          unread.updateAttributes({
                              read: "read"
                          });
                      });
                      callback(null, _.size(unread));
                  }
                  else{
                      callback(null, 0);
                  }
              });
          }
          else{
            callback(null, 0);
          }
      }],function(err, result){
        // console.log(result)
        var isAuthor
        if(req.session.user)
          isAuthor = (req.session.user.member_id==post.member_id);
        else
          isAuthor = 0;
        console.log(result);
        res.json({
          post:post,
          likeThis:result[0], 
          like:result[1],
          comments:result[2], 
          isSubscribe: result[3],
          reads: result[4],
          isAuthor:isAuthor
          
        });
      })
    
  });
};

exports.destroy = function(req, res){
  console.log(req.param('issue_id'));
  models.Issue.sync().success(function() {
      models.Issue
      .find({where: {issue_id: req.param('issue_id')}}).success(function(result){
        console.log('retrieve success');
        if (req.session.user.member_id == result.member_id){
            result.destroy().success(function() {
                res.json({success: 'yes'});
              }).error(function(error) {
            // Ooops, do some error-handling
            console.log(error);
            res.json({success: 'no'});
          })
        }else{
          res.status(401).json({error:true,msg:"You are not the creator."});
        }
        
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
        if (req.session.user.member_id == result.member_id) {
            result.updateAttributes({title:req.body.title, content:req.body.content, parent_issue:req.body.parent_issue, postCategory_id: req.body.postCategory_id}).success(function(updatedResult) {
                res.json(updatedResult);
              }).error(function(error) {
            // Ooops, do some error-handling
            console.log(error);
            res.json(error);
          })
        }else{
          res.status(401).json({error:true,msg:"You are not the creator."});
        }
        
      }).error(function(error) {
        // Ooops, do some error-handling
        console.log(error);
        res.json(error);
      })   
  })
};