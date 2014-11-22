exports.Like = function(Sequelize, sequelize){
  return sequelize.define('Like', {

    issue_id: { type: Sequelize.STRING},
    member_id: { type: Sequelize.STRING },

  },{
    tableName: 'like'
  });
}