var models  = require('../models');

exports.create = function(req, res){
  console.log(req.body);
  models.Issue.sync().success(function() {
    // here comes your find command.
      models.Issue
      .build({title:req.body.title, member_id:req.body.member_id, content:req.body.content, parent_issue:req.body.parent_issue})
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
      .findAll({include: [ models.Member ],order: [['createdAt', 'DESC']]}).success(function(result){
        console.log('retrieve success');
        res.json(result);
      })
  })
};


exports.listById = function(req, res){
  console.log(req.param('issue_id'));
  models.Issue.sync().success(function() {
      models.Issue
      .find({where: {issue_id: req.param('issue_id')},include: [ models.Member ], order: [['createdAt', 'DESC']] }).success(function(result){
        console.log('retrieve success');
        res.json(result);
      })   
  }).error(function(error) {
        // Ooops, do some error-handling
        console.log(error);
        res.json(error);
      })
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