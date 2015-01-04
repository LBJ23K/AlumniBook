var models  = require('../models');
var _ = require('underscore');
var async = require('async');
var Member = require('../models').Member;
var Issue = require('../models').Issue;
var Comment = require('../models').Comment;
var Like = require('../models').Like;
var PostCategory = require('../models').PostCategory;
var sanitizer = require('sanitizer');

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
    // console.log(post)
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

// search issues
// supports search by 'title' and 'member name' now.
exports.search = function(req, res) {
  var body = req.body;
  var searchText = "%" + body.searchText + "%";
  if (body.field == "title") {
    // user searches for title
    // first of all, sync Issue
    Issue.sync().success(function() {
      // find all issues which title contains searchText
      Issue.findAll({where: {title: {like: searchText}}}).success(function(results) {
        // handle process success

        // if no result, return an empty array
        if (!results || results.length == 0) res.json([]);
        // else return results
        res.json(results);

      }).error(function(error) {
        // handle process error
        res.status(500).json(error);
      });
    });
  } else if (body.field == "author") {
    // user searches for author name
    // first of all, sync Member
    Member.sync().success(function() {
      // find all members whose name contains searchText
      Member.findAll({where: {name: {like: searchText}}}).success(function(members) {
        // if no member, return an empty array
        if (!members || members.length == 0) {
          res.json([]);
        }

        // we found some members
        // sync Issue
        Issue.sync().success(function() {
          // for each member, get her member_id and than get her issues
          var issues = [];
          async.each(members, function(member, cb) {
            var member_id = member.dataValues.member_id;
            Issue.findAll({where: {member_id: member_id}}).success(function(memberIssues) {
              issues = issues.concat(memberIssues);
              cb();
            }).error(function(err) {
              cb(err);
            });

          }, function(err) {
            // if error occurs during async process
            if (err) res.status(500).json(err);

            // else, every thing was fine
            // return issues to client
            res.json(issues);
          });
        });

      }).error(function(error) {
        console.log(error);
        res.status(500).json(error);
      });
    });

  } else {
    // user searches for fields that we haven't implement yet
    res.status(500).json({error: "not implement yet"});
  }
};
