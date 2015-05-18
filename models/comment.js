exports.Comment = function(Sequelize, sequelize){
  return sequelize.define('Comment', {

    comment_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true }, 
    issue_id: { type: Sequelize.STRING},
    member_id: { type: Sequelize.STRING },
    content: Sequelize.STRING,

  },{
    tableName: 'comment'
  });
}