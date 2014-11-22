var _ = require('underscore');
var async = require('async');
var Member = require('../models').Member;
var Issue = require('../models').Issue;
var Comment = require('../models').Comment;
var Like = require('../models').Like;

exports.destroy = function(req, res){
  console.log(req.param('comment_id'));
  Comment.sync().success(function() {
      Comment
      .find({where: {comment_id: req.param('comment_id')}}).success(function(result){
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
  console.log(req.body.comment_id);
  Comment.sync().success(function() {
      Comment
      .find({where: {comment_id: req.body.comment_id}}).success(function(result){
        console.log('retrieve success');
        result.updateAttributes({content:req.body.content}).success(function(updatedResult) {
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