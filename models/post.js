exports.Post = function(Sequelize, sequelize){
  return sequelize.define('Post', {

    post_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true }, 
    member_id: { type: Sequelize.STRING},
    title: { type: Sequelize.STRING },
    content: Sequelize.STRING,

  },{
    tableName: 'post'
  });
}