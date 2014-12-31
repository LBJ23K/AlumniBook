var PostCategory = require('../models').PostCategory;

exports.create = function(req, res){
  console.log(req.body);
  // var title = sanitizer.sanitize(req.body.title);
  // var content = sanitizer.sanitize(req.body.content);
  PostCategory.sync().success(function() {
    // here comes your find command.
      PostCategory
      .build(req.body)
      .save()
      .success(function(anotherTask) {
        // you can now access the currently saved task with the variable anotherTask... nice!
        console.log('Created an category');
        //res.send("respond with a resource");
        res.json(anotherTask);
      }).error(function(error) {
        // Ooops, do some error-handling
        console.log(error);
      })
  })
};

exports.list = function(req, res){
  PostCategory.sync().success(function() {
    // here comes your find command.
      PostCategory
      .findAll().success(function(result){
        console.log('retrieve success');
        res.json(result);
      })
  })
};


exports.destroy = function(req, res){
  console.log(req.param('postCategory_id'));
  PostCategory.sync().success(function() {
      PostCategory
      .find({where: {postCategory_id: req.param('postCategory_id')}}).success(function(result){
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
  console.log(req.body.postCategory_id);
  PostCategory.sync().success(function() {
      PostCategory
      .find({where: {postCategory_id: req.body.postCategory_id}}).success(function(result){
        console.log('retrieve success');
          result.updateAttributes(req.body).success(function(updatedResult) {
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