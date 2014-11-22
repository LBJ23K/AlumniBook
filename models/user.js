exports.User = function(Sequelize, sequelize){
  return sequelize.define('User', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true }, 
    username: { type: Sequelize.STRING},
    password: { type: Sequelize.STRING },
  },{
    tableName: 'user'
  });
}