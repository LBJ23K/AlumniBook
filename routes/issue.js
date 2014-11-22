var models  = require('../models');

exports.create = function(req, res){
  console.log(req.body);
  models.Issue.sync().success(function() {
    // here comes your find command.
      models.Issue
      .build({title:req.body.title, author:req.body.author, content:req.body.content, parent_issue:req.body.parent_issue })
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
      .findAll({order: [['createdAt', 'DESC']]}).success(function(result){
        console.log('retrieve success');
        res.json(result);
      })
  })
};


exports.listById = function(req, res){
  console.log(req.param('id'));
  models.Issue.sync().success(function() {
      models.Issue
      .find({where: {id: req.param('id')}, order: [['createdAt', 'DESC']] }).success(function(result){
        console.log('retrieve success');
        res.json(result);
      })   
  })
};